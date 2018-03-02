import os

from feedgen.feed import FeedGenerator
import mistune

from .constants import *

BASE_URL = 'https://stcolumbas.freechurch.org'
markdown = mistune.Markdown()


def write_feed(posts):
    fg = FeedGenerator()
    fg.id(f'{BASE_URL}/headlines/')
    fg.title('St Columbas\'s - Headlines')
    fg.author(name='St Columba\'s Free Church', email='help@stcsfc.org')
    fg.link(href=f'{BASE_URL}/headlines')
    fg.logo(f'{BASE_URL}/static/images/stcolumbas-logo-small.png')
    fg.language('en')
    fg.description('St Columba\'s Free Church Headlines')

    for p in posts:
        fe = fg.add_entry()
        fe.id(f'{BASE_URL}/{p["path"]}')
        fe.title(p['title'])
        fe.link(href=f'{BASE_URL}/{p["path"]}')
        fe.author(name=p['author'])
        fe.summary(p['intro'])
        fe.content(markdown(p['body']))

    rss_path = os.path.join(DIST_DIR, 'headlines', 'rss.xml')
    atom_path = os.path.join(DIST_DIR, 'headlines', 'atom.xml')
    print(rss_path)
    fg.rss_file(rss_path)
    print(atom_path)
    fg.atom_file(atom_path)
