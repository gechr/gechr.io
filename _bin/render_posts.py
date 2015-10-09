#!/usr/bin/env python

import markdown
import os
import yaml

import jinja2 as j2

POST_OUTDIR = 'public/posts'

TEMPLATE_INDIR = '_templates'
POST_INDIR = '_posts'

CONFIG_FILE = '_config.yml'
TEMPLATE_FILE = 'post.html'

WPM_SPEED = 200

def _listdir_full(d):
    return [os.path.join(d, f) for f in os.listdir(d)]

def _parse_title(file):
    return ' '.join(post.title() for post in file[:-3].split('-'))

def _calulate_wpm(content):
    wpm = len(content.split()) / WPM_SPEED
    return "< 1min" if wpm == 0 else "%d min" % wpm

def render():
    with open('_config.yml', 'r') as f:
        config = yaml.load(f)

    markdown_files = _listdir_full(POST_INDIR)
    for file in markdown_files:
        with open('%s/%s' % (POST_INDIR, file), 'r') as f:
            content = f.read()

        title = _parse_title(file)

        md = markdown.markdown(content, extensions=['codehilite'])

        loader = j2.FileSystemLoader(searchpath=TEMPLATE_INDIR)
        env = j2.Environment(loader=loader, lstrip_blocks=True, trim_blocks=True)
        template = env.get_template(TEMPLATE_FILE)
        output = template.render(title=title, content=md, **config)

        html_filename = os.path.splitext(file)[0] + '.html'
        with open('%s/%s' % (POST_OUTDIR, html_filename), 'w') as f:
            f.write(output)

if __name__ == '__main__':
    render()