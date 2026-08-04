---
layout: portfolio
title: Conversational Navigation for Smart Glasses
portfolio_slug: smart-glasses
description: Landmark-grounded indoor guidance from a single user photo.
portfolio: true
---

## Navigation that sounds human

Indoor directions are easier to follow when they reference what people can actually see: “walk past the sofa, then turn right at the stairs” is more useful than a sequence of headings and distances. This project connects visual localization, geometric planning, semantic perception, and language generation into one mixed-reality system.

## My contribution

I implemented the hierarchical localization pipeline using NetVLAD retrieval, SuperPoint + SuperGlue matching, and PnP + RANSAC for single-image 6-DoF pose estimation. I also built a Habitat-Sim workflow that samples routes, extracts persistent semantic landmarks, and creates 5,000 instruction-tuning examples using a teacher language model.

The final lightweight model uses LoRA fine-tuning to generate concise landmark-grounded instructions and can run locally, preserving privacy while avoiding a permanent cloud dependency.

## Outcome

Across 50 end-to-end runs, the system averaged approximately **12.75 seconds** per query. Visual localization remained the main bottleneck; planning, landmark extraction, and language generation stayed within interactive latency for real-building trials.
