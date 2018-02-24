import codecs
import os

from .constants import *
from .feed import write_feed
from .utils import group_into, load_yaml, yaml


def extract_tags(posts):
    tags = [_extract_tags(p) for p in posts]
    # flatten lists:
    tags = [item for sublist in tags for item in sublist]
    return list(set(tags))


def _extract_tags(post):
    tags = [t.strip() for t in post['tags']]
    return tags


def generate_post_path(orig_path):
    # extract only the filename
    fname = os.path.basename(orig_path)
    # pull out the date, assuming: yyyy-mm-dd-title.md
    year, month, day, *rest = fname.split('-')
    # reassemble slug
    slug = '-'.join(rest)
    slug = slug.replace('.md', '')
    # assemble new path
    new_path = os.path.join('headlines', year, month, day, slug)

    return new_path


def write_post(env, post):
    result = env.get_template(post['layout'] + '.html').render(
        data=post,
        content=post,
        uri=post['path'],
    )
    new_path = os.path.join(DIST_DIR, post['path'] + '.html')
    os.makedirs(os.path.dirname(new_path), exist_ok=True)
    print(new_path)
    with open(new_path, 'w') as f:
        f.write(result)


def load_post(fname):
    with codecs.open(fname, encoding='utf-8', mode='r') as f:
        d = f.read()
    parts = d.split('\n---\n')
    assert parts[0].startswith('---')
    assert len(parts) == 2
    raw_frontmatter = parts[0]
    body = parts[1]

    frontmatter = yaml.load(raw_frontmatter)
    frontmatter['body'] = body

    return frontmatter


def paginate(posts, prefix='headlines'):
    groups = group_into(posts, 5)
    pagination = []
    for idx, g in enumerate(groups):
        if idx == 0:
            prev_link = None
        elif idx == 1:
            prev_link = f'/{prefix}'
        else:
            prev_link = f'/{prefix}/{idx - 1}.html'

        next_link = f'/{prefix}/{idx + 1}.html'

        pagination.append({
            'prev': prev_link,
            'next': next_link,
            'posts': g,
        })

    pagination[-1]['next'] = None  # no next for last group

    return pagination


def _write_blog_index(env, idx, data, tag_page=False, tag=None):
    if idx == 0:
        if tag_page:
            path = os.path.join(DIST_DIR, 'headlines', 'tags', f'{tag}.html')
        else:
            path = os.path.join(DIST_DIR, 'headlines.html')
    else:
        if tag_page:
            path = os.path.join(DIST_DIR, 'headlines', 'tags', tag, f'{str(idx)}.html')
        else:
            path = os.path.join(DIST_DIR, 'headlines', f'{str(idx)}.html')

    data['uri'] = path.replace(DIST_DIR, '').replace('.html', '')
    data['tag'] = tag
    result = env.get_template('headlines.html').render(data)

    os.makedirs(os.path.dirname(path), exist_ok=True)
    print(path)
    with open(path, 'w') as f:
        f.write(result)


def write_blog_index(env, files):
    """"""
    posts = []
    for f in files:
        post = load_post(f)
        post['path'] = generate_post_path(f)
        posts.append(post)
        write_post(env, post)

    posts = sorted(posts, key=lambda p: p['date'])
    posts = list(reversed(posts))

    tags = extract_tags(posts)
    pagination = paginate(posts)

    # write index:
    for idx, paged_data in enumerate(pagination):
        _write_blog_index(
            env,
            idx,
            {
                'data': {
                    'title': 'Headlines'
                },
                'tags': tags,
                'pagination': paged_data,
            },
        )
    # write tag index pages:
    for tag in tags:
        tagged_posts = [p for p in posts if tag in p['tags']]
        for idx, paged_data in enumerate(paginate(tagged_posts, prefix=f'headlines/tags/{tag}')):
            _write_blog_index(
                env,
                idx,
                {
                    'data': {
                        'title': 'Headlines'
                    },
                    'tags': tags,
                    'pagination': paged_data,
                },
                tag_page=True,
                tag=tag,
            )

    # write rss:
    write_feed(posts)
