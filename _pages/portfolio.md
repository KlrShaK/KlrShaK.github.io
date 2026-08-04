---
layout: page
title: Portfolio
permalink: /portfolio/
description: Research, robots, and intelligent systems — shown in motion.
nav: true
nav_order: 5
portfolio: true
---

<div class="portfolio-shell">
  <section class="portfolio-intro" aria-labelledby="portfolio-intro-title">
    <p class="portfolio-kicker">Selected work · 2020—2026</p>
    <h2 id="portfolio-intro-title">I build systems that perceive, reason, and act.</h2>
    <p>
      My work moves between embodied AI, computer vision, robotics, and the software that makes research usable.
      Start with the demos; follow the links when you want the implementation details.
    </p>
    <div class="portfolio-stats" aria-label="Portfolio highlights">
      <span><strong>ECCV ’26</strong> publication</span>
      <span><strong>GSoC ’25</strong> · OpenCV</span>
      <span><strong>8+</strong> deployed systems</span>
    </div>
  </section>

  <nav class="portfolio-filters" aria-label="Filter portfolio work">
    <button class="portfolio-filter is-active" type="button" data-filter="all" aria-pressed="true">All work</button>
    <button class="portfolio-filter" type="button" data-filter="research" aria-pressed="false">Research</button>
    <button class="portfolio-filter" type="button" data-filter="robotics" aria-pressed="false">Robotics</button>
    <button class="portfolio-filter" type="button" data-filter="embodied-ai" aria-pressed="false">Embodied AI</button>
    <button class="portfolio-filter" type="button" data-filter="computer-vision" aria-pressed="false">Computer vision</button>
    <button class="portfolio-filter" type="button" data-filter="software" aria-pressed="false">Software</button>
    <button class="portfolio-filter" type="button" data-filter="leadership" aria-pressed="false">Leadership</button>
  </nav>

  <section class="portfolio-section" aria-labelledby="featured-work">
    <div class="portfolio-section-heading">
      <p>Watch first</p>
      <h2 id="featured-work">Flagship work</h2>
    </div>
    <div class="portfolio-featured">
      {% assign featured_work = site.data.portfolio | where: 'featured', true %}
      {% for item in featured_work %}
        {% include portfolio/card.liquid item=item variant='featured' index=forloop.index %}
      {% endfor %}
    </div>
    <p class="portfolio-empty" role="status" hidden>No work matches this filter.</p>
  </section>

  <section class="portfolio-section portfolio-journey" aria-labelledby="experience-heading">
    <div class="portfolio-section-heading">
      <p>Where the work happened</p>
      <h2 id="experience-heading">Experience & leadership</h2>
    </div>
    <ol class="portfolio-timeline">
      {% assign timeline = site.data.portfolio | where: 'timeline', true | sort: 'timeline_order' %}
      {% for item in timeline %}
        <li class="portfolio-timeline-item portfolio-filterable" data-categories="{{ item.categories | join: ' ' }}">
          <div class="portfolio-timeline-date">{{ item.period }}</div>
          <div class="portfolio-timeline-copy">
            <p class="portfolio-eyebrow">{{ item.context }}</p>
            <h3>{{ item.title }}</h3>
            <p>{{ item.summary }}</p>
            {% include portfolio/actions.liquid links=item.links detail_url=item.detail_url compact=true %}
          </div>
        </li>
      {% endfor %}
    </ol>
  </section>

  <section class="portfolio-section" aria-labelledby="more-work">
    <div class="portfolio-section-heading">
      <p>More experiments & publications</p>
      <h2 id="more-work">Supporting work</h2>
    </div>
    <div class="portfolio-grid">
      {% assign supporting_work = site.data.portfolio | where: 'supporting', true %}
      {% for item in supporting_work %}
        {% include portfolio/card.liquid item=item variant='compact' index=forloop.index %}
      {% endfor %}
    </div>
  </section>

  <section class="portfolio-section portfolio-recognition" aria-labelledby="recognition-heading">
    <div class="portfolio-section-heading">
      <p>Recognition</p>
      <h2 id="recognition-heading">Milestones along the way</h2>
    </div>
    <div class="recognition-grid">
      {% for item in site.data.recognition %}
        {% include portfolio/recognition.liquid item=item %}
      {% endfor %}
    </div>
  </section>
</div>
