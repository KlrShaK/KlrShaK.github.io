---
layout: portfolio
title: ActuatorIQ
portfolio_slug: actuator-iq
description: AI-assisted HVAC diagnostics, recovery, and building safety.
portfolio: true
---

## Listening to the actuator

A valve actuator’s torque, position, power, and temperature traces reveal far more than whether it is open or closed. ActuatorIQ turns those signals into commissioning evidence, maintenance alerts, and active building-safety actions.

## My contribution

I engineered full-stroke calibration, automatic blockage detection, and a **retreat–cooldown–retry** recovery sequence. I also integrated live Belimo telemetry and setpoint control through a Raspberry Pi 5 and InfluxDB, adding resilient retries for unreliable real-time connections.

The wider team combined this hardware path with anomaly detection, an interactive Three.js building twin, fire-spread simulation, thermal and camera views, valve-sizing analysis, and an AI building doctor.

## Outcome

ActuatorIQ won **runner-up at START Hack 2026’s Belimo Challenge**. The repository includes the web application, live-control utilities, trained fault model, reports, and videos of both normal operation and physical blockages.
