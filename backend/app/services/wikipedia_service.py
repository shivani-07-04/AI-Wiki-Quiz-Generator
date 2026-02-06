import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, unquote
from typing import Optional, List, Tuple
import re
import logging
from app.utils.errors import WikipediaScrapingError, InvalidWikipediaURLError

logger = logging.getLogger(__name__)

class WikipediaService:
    """Service for scraping and processing Wikipedia articles"""
    
    def __init__(self, timeout: int = 30):
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def _validate_wikipedia_url(self, url: str) -> bool:
        """Validate that URL is a Wikipedia article"""
        try:
            parsed = urlparse(url)
            return (
                'wikipedia.org' in parsed.netloc and
                '/wiki/' in parsed.path and
                parsed.path.strip() != '/wiki/'
            )
        except Exception:
            return False

    def get_article_content(self, url: str) -> Optional[dict]:
        """
        Scrape Wikipedia article and extract structured content
        Returns: {
            'title': str,
            'summary': str,
            'image_url': str,
            'sections': [{'title': str, 'content': str}],
            'infobox': dict
        }
        """
        # Validate URL
        if not self._validate_wikipedia_url(url):
            logger.warning(f"Invalid Wikipedia URL: {url}")
            raise InvalidWikipediaURLError(
                f"Invalid Wikipedia URL: {url}. Must be a valid Wikipedia article URL."
            )
        
        try:
            logger.info(f"Scraping Wikipedia article: {url}")
            response = self.session.get(url, timeout=self.timeout)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract title
            title = self._extract_title(soup)
            
            # Extract lead image
            image_url = self._extract_image(soup)
            
            # Extract summary (first paragraphs)
            summary = self._extract_summary(soup)
            
            # Extract sections
            sections = self._extract_sections(soup)
            
            # Extract infobox data
            infobox = self._extract_infobox(soup)
            
            logger.info(f"Successfully scraped article: {title}")
            return {
                'title': title,
                'summary': summary,
                'image_url': image_url,
                'sections': sections,
                'infobox': infobox,
                'raw_html': str(soup)
            }
        except requests.Timeout:
            logger.error(f"Timeout fetching Wikipedia article: {url}")
            raise WikipediaScrapingError(
                f"Request timeout. Wikipedia took too long to respond. Please try again."
            )
        except requests.ConnectionError as e:
            logger.error(f"Connection error: {str(e)}")
            raise WikipediaScrapingError(
                "Connection error. Could not reach Wikipedia. Check your internet connection."
            )
        except requests.RequestException as e:
            logger.error(f"Request failed: {str(e)}")
            raise WikipediaScrapingError(
                f"Failed to fetch Wikipedia article: {str(e)}"
            )
        except Exception as e:
            logger.error(f"Unexpected error scraping Wikipedia: {str(e)}")
            raise WikipediaScrapingError(
                f"Unexpected error while scraping: {str(e)}"
            )
    
    def _extract_title(self, soup: BeautifulSoup) -> str:
        """Extract article title"""
        title_elem = soup.find('h1', {'class': 'firstHeading'})
        if title_elem:
            return title_elem.get_text(strip=True)
        return "Unknown Title"
    
    def _extract_image(self, soup: BeautifulSoup) -> Optional[str]:
        """Extract main article image"""
        try:
            # Try to get infobox image first
            infobox = soup.find('table', {'class': 'infobox'})
            if infobox:
                img = infobox.find('img')
                if img:
                    return self._get_full_image_url(img.get('src', ''))
            
            # Fall back to first image in content
            content = soup.find('div', {'id': 'mw-content-text'})
            if content:
                img = content.find('img')
                if img:
                    return self._get_full_image_url(img.get('src', ''))
        except Exception:
            pass
        
        return None
    
    def _get_full_image_url(self, src: str) -> str:
        """Convert relative image URL to absolute"""
        if src.startswith('http'):
            return src
        if src.startswith('//'):
            return 'https:' + src
        return 'https://en.wikipedia.org' + src
    
    def _extract_summary(self, soup: BeautifulSoup) -> str:
        """Extract first few paragraphs as summary"""
        content = soup.find('div', {'id': 'mw-content-text'})
        if not content:
            return ""
        
        paragraphs = []
        for p in content.find_all('p', limit=3):
            text = p.get_text(strip=True)
            if text and not text.startswith('['):
                paragraphs.append(text)
        
        return ' '.join(paragraphs)[:1000]  # Limit to 1000 chars
    
    def _extract_sections(self, soup: BeautifulSoup) -> List[dict]:
        """Extract main sections of the article"""
        sections = []
        content = soup.find('div', {'id': 'mw-content-text'})
        
        if not content:
            return sections
        
        current_section = None
        
        for elem in content.find_all(['h2', 'h3', 'p']):
            if elem.name in ['h2', 'h3']:
                # Extract section heading
                heading = elem.find('span', {'class': 'mw-headline'})
                if heading:
                    section_title = heading.get_text(strip=True)
                    if current_section and current_section['content'].strip():
                        sections.append(current_section)
                    current_section = {'title': section_title, 'content': ''}
            
            elif elem.name == 'p' and current_section:
                text = elem.get_text(strip=True)
                if text and not text.startswith('['):
                    current_section['content'] += ' ' + text
        
        if current_section and current_section['content'].strip():
            sections.append(current_section)
        
        # Return top 5 sections
        return sections[:5]
    
    def _extract_infobox(self, soup: BeautifulSoup) -> dict:
        """Extract infobox data"""
        infobox_data = {}
        infobox = soup.find('table', {'class': 'infobox'})
        
        if infobox:
            for row in infobox.find_all('tr'):
                cells = row.find_all(['th', 'td'])
                if len(cells) >= 2:
                    key = cells[0].get_text(strip=True)
                    value = cells[1].get_text(strip=True)
                    infobox_data[key] = value
        
        return infobox_data
    
    def extract_related_topics(self, soup: BeautifulSoup, limit: int = 5) -> List[dict]:
        """Extract related topics from 'See also' or 'Related articles' sections"""
        related = []
        
        # Find "See also" section
        for heading in soup.find_all(['h2', 'h3']):
            heading_text = heading.get_text(strip=True).lower()
            if 'see also' in heading_text or 'related' in heading_text:
                # Get the next list
                ul = heading.find_next('ul')
                if ul:
                    for li in ul.find_all('li', limit=limit):
                        link = li.find('a')
                        if link:
                            title = link.get_text(strip=True)
                            href = link.get('href', '')
                            if href.startswith('/wiki/'):
                                url = 'https://en.wikipedia.org' + href
                                related.append({
                                    'title': title,
                                    'url': url,
                                    'summary': None,
                                    'image_url': None
                                })
        
        return related[:limit]
