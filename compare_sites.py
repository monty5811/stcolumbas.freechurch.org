'''
Compare two instances of the website, generates a bunch of comparison images in
screenshots/

Requires:
    - selenium
    - firefox
    - imagemagick

Usage:
    `xvfb-run -a python compare_sites.py http://old.name http://new.name
'''
import argparse
import os
import subprocess
from time import sleep

from selenium import webdriver


def get_screenshot(d, base_url, url_path):
    '''Grab screenshot of page'''
    full_url = base_url + url_path
    print('Fetching ', full_url)
    file_name = os.path.join(
        'screenshots',
        full_url.replace("://", "_").replace(".", "_").replace("/", "_") + '.png'
    )

    d.get(full_url)
    d.execute_script('return window.scrollTo(0,0)');

    d.set_window_size(1200, 4000)
    sleep(1)
    d.get_screenshot_as_file(file_name)

    return file_name


def compare(url, old_path, new_path):
    '''Generate comparisons'''
    safe_url = url.replace('/', '_')

    sh = f'compare {old_path} {new_path} screenshots/compare_{safe_url}.png'
    subprocess.run(sh, shell=True)
    sh = f'convert screenshots/compare_{safe_url}.png -fuzz 1% -trim +repage screenshots/compare_{safe_url}.png'
    subprocess.run(sh, shell=True)

    sh = f'montage {old_path} {new_path} -mode concatenate -tile x1 -background none screenshots/{safe_url}_side_by_side.png'
    subprocess.run(sh, shell=True)
    sh = f'convert screenshots/{safe_url}_side_by_side.png -fuzz 1% -trim +repage screenshots/{safe_url}_side_by_side.png'
    subprocess.run(sh, shell=True)


URLS = [
    '/',
    '/jesus',
    '/about/our-team',
    '/about/contact-us',
    '/about/our-vision',
    '/about/church-plants',
    '/connect/community',
    '/connect/ministries',
    '/connect/serving',
    '/connect/visit',
    '/connect/giving',
]


parser = argparse.ArgumentParser(description='Compare sites.')
parser.add_argument('old_url', type=str, help='Old site url')
parser.add_argument('new_url', type=str, help='New site url')


if __name__ == '__main__':
    os.makedirs('screenshots')
    driver = webdriver.Firefox()
    driver.implicitly_wait(1)
    driver.set_window_size(1200, 4000)

    args = parser.parse_args()
    old_url = args.old_url
    new_url = args.new_url

    for url_path in URLS:
        old_path = get_screenshot(driver, old_url, url_path)
        new_path = get_screenshot(driver, new_url, url_path)
        compare(url_path, old_path, new_path)
