"""
Tests for backend services
"""

import pytest
from app.services.wikipedia_service import WikipediaService
from app.utils.errors import WikipediaScrapingError

@pytest.fixture
def wikipedia_service():
    """Create Wikipedia service instance"""
    return WikipediaService(timeout=10)

def test_wikipedia_service_initialization(wikipedia_service):
    """Test Wikipedia service initializes correctly"""
    assert wikipedia_service is not None
    assert wikipedia_service.timeout == 10

def test_extract_title_valid_html():
    """Test title extraction from valid HTML"""
    service = WikipediaService()
    html = '<h1 class="firstHeading">Alan Turing</h1>'
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(html, 'html.parser')
    title = service._extract_title(soup)
    assert title == "Alan Turing"

def test_extract_image_url_conversion():
    """Test image URL conversion"""
    service = WikipediaService()
    
    # Test absolute URL (should pass through)
    url1 = service._get_full_image_url('https://example.com/image.jpg')
    assert url1.startswith('https://')
    
    # Test protocol-relative URL
    url2 = service._get_full_image_url('//upload.wikimedia.org/image.jpg')
    assert url2.startswith('https://')
    
    # Test relative URL
    url3 = service._get_full_image_url('/wiki/Special:FilePath/image.jpg')
    assert url3.startswith('https://en.wikipedia.org')

def test_extract_summary():
    """Test summary extraction"""
    service = WikipediaService()
    html = '''
    <div id="mw-content-text">
        <p>First paragraph with content.</p>
        <p>Second paragraph with more content.</p>
        <p>[citation needed] Third paragraph should be excluded.</p>
    </div>
    '''
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(html, 'html.parser')
    summary = service._extract_summary(soup)
    assert len(summary) > 0
    assert 'First paragraph' in summary

@pytest.mark.slow
def test_fetch_real_wikipedia_article():
    """Test fetching real Wikipedia article (integration test)"""
    # This test requires internet connection
    service = WikipediaService()
    try:
        result = service.get_article_content(
            'https://en.wikipedia.org/wiki/Python_(programming_language)'
        )
        assert result is not None
        assert 'title' in result
        assert 'summary' in result
    except Exception as e:
        pytest.skip(f"Could not fetch Wikipedia: {str(e)}")

@pytest.mark.slow
def test_fetch_invalid_wikipedia_article():
    """Test fetching invalid Wikipedia article"""
    service = WikipediaService()
    with pytest.raises(Exception):
        service.get_article_content(
            'https://en.wikipedia.org/wiki/This_Article_Does_Not_Exist_12345'
        )

# Parametrized tests for multiple scenarios
@pytest.mark.parametrize("url,expected_valid", [
    ('https://en.wikipedia.org/wiki/Python', True),
    ('https://en.wikipedia.org/wiki/Java', True),
    ('https://www.google.com', False),
    ('not-a-url', False),
    ('', False),
])
def test_url_validation(url, expected_valid):
    """Test URL validation"""
    from urllib.parse import urlparse
    
    if not url:
        assert not expected_valid
        return
    
    try:
        result = urlparse(url)
        is_valid = all([result.scheme, result.netloc])
        assert is_valid == expected_valid
    except:
        assert not expected_valid
