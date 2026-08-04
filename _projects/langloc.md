---
layout: portfolio
title: "LangLoc: Tell Me What You See"
portfolio_slug: langloc
description: Fine-grained indoor localization from language alone.
portfolio: true
---

## The question

Could an embodied agent locate a person inside a known 3D environment from a sentence such as “I am beside a sofa, facing a table”—without receiving a photo or GPS signal?

LangLoc turns that sentence into a text scene graph, retrieves the matching 3D scene, and then estimates the observer’s position and heading from object visibility. When several viewpoints remain plausible, a Bayesian dialog module asks targeted yes/no questions until the pose becomes unambiguous.

## What I built

I worked across language-to-3D grounding and fine localization: matching caption scene-graph nodes to 3D-SSG objects, computing geometry-aware visibility with Open3D ray casting, and converting those signals into spatial heatmaps and pose estimates. The final system also incorporates a dual-branch GATv2 retrieval model with CLIP semantic features.

## Outcome

The system reaches a median localization error of **0.95 m**, improves scene-retrieval Top-1 recall by eight percentage points over the previous best, and introduces a benchmark of more than 13,000 pose-indexed descriptions over 1,300 indoor scans. The work was accepted at **ECCV 2026**.
