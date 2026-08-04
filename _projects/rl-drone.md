---
layout: portfolio
title: Deep-RL Vision-Based Drone Control
portfolio_slug: rl-drone
description: A PPO policy transferred from simulation to real-world target following.
portfolio: true
---

## From pixels to flight commands

This project asks a drone to follow a target using visual observations while keeping a safe distance and stable altitude. The policy must act under partial observability and tolerate the visual and dynamic mismatch between a simulator and a physical aircraft.

## The control stack

I trained a **Proximal Policy Optimization (PPO)** controller around a double-sphere bounding-box simulator, field-of-view-aware rewards, smooth command generation, and domain randomization. The perception-to-control interface was kept intentionally compact so the same policy could move from simulation into the ROS2 flight stack.

## Real-world result

The deployed controller followed the target safely while holding altitude with a mean error of **−0.10 m**. The demo and report cover the reward design, sim-to-real choices, flight architecture, and failure cases.
