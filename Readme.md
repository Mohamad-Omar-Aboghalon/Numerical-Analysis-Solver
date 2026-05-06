# Numerical Analysis Project

This project is a browser-based numerical methods solver built with plain HTML, CSS, and JavaScript. It provides a simple interface for solving nonlinear equations and systems of linear equations, then displays the iteration steps and final results in a console-style output panel.

<img width="1367" height="806" alt="Screenshot 2026-05-05 170732" src="https://github.com/user-attachments/assets/7669c73f-3f32-4302-abd0-86333ad147b8" />

## Supported Methods

- Bisection
- Fixed Point
- False Position
- Newton-Raphson
- Secant
- Gauss Elimination
- Gauss-Jordan
- Cramer's Rule
- LU Decomposition

## How to Run

Open `index.html` in your browser, choose a method, enter the required inputs, and click `Solve`.

## Input Notes

- Nonlinear methods accept expressions such as `x**3 - x - 2`.
- Supported math forms include `sin(x)`, `cos(x)`, `tan(x)`, `sqrt(x)`, `log(x)`, `exp(x)`, `pi`, and `e`.
- Linear systems should be entered one equation per line using variables like `x1`, `x2`, `x3`.

## Project Files

- `index.html` - application structure
- `styles.css` - interface styling
- `app.js` - solver logic and input handling
