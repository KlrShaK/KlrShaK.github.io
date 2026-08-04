---
layout: portfolio
title: No-GPS Drone Navigation
portfolio_slug: no-gps-drone
description: Efficient perception and sensing for navigation where GPS cannot be trusted.
portfolio: true
---

## Research in the loop

During my ThinkSwiss research stay at Bern University of Applied Sciences, I worked on a drone designed to navigate through GPS-denied environments using onboard perception and sensing.

## Perception on constrained hardware

I redesigned the segmentation network around a transformer decoder and combined augmentation with transfer learning. The resulting model improved F1 score from **64.11 to 88.38** while sustaining **67 FPS** on a Jetson Orin Nano.

I also led selection and integration of cameras, altimeters, and inertial sensors, then developed a synchronized acquisition pipeline with filtering and augmentation so downstream components received reliable data.

## Beyond the benchmark

This was as much a systems project as a model-training project: every accuracy improvement had to survive an embedded compute budget, real sensors, and flight constraints. The linked demo and field notes show that wider context.
