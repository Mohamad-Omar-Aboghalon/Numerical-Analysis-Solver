// Available solver methods shown in the dropdown.
const methods = [
  "Bisection",
  "Fixed Point",
  "False Position",
  "Newton-Raphson",
  "Secant",
  "Gauss Elimination",
  "Gauss-Jordan",
  "Cramer-Rule",
  "LU-Decomposition",
];

// Cached DOM references for the interactive UI.
const methodSelect = document.getElementById("method");
const dynamicFields = document.getElementById("dynamic-fields");
const criteriaSection = document.getElementById("criteria-section");
const solveBtn = document.getElementById("solve-btn");
const clearInputsBtn = document.getElementById("clear-inputs-btn");
const clearOutputBtn = document.getElementById("clear-output-btn");
const output = document.getElementById("output");

// Default values preserved while switching between nonlinear methods.
const nonlinearDefaults = {
  equation: "",
  derivative: "",
  val1: "",
  val2: "",
  es: "0.01",
  iterations: "50",
};

// Default values preserved while switching between linear methods.
const linearDefaults = {
  systemSize: "2",
  equations: "",
};

// Store current input values before rebuilding the dynamic form.
function rememberCurrentInputs() {
  const equation = document.getElementById("equation");
  const derivative = document.getElementById("derivative");
  const val1 = document.getElementById("val1");
  const val2 = document.getElementById("val2");
  const systemSize = document.getElementById("system-size");
  const systemEquations = document.getElementById("system-equations");

  if (equation) {
    nonlinearDefaults.equation = equation.value;
  }
  if (derivative) {
    nonlinearDefaults.derivative = derivative.value;
  }
  if (val1) {
    nonlinearDefaults.val1 = val1.value;
  }
  if (val2) {
    nonlinearDefaults.val2 = val2.value;
  }
  if (systemSize) {
    linearDefaults.systemSize = systemSize.value;
  }
  if (systemEquations) {
    linearDefaults.equations = systemEquations.value;
  }
}

// Check whether the selected method solves a linear system.
function isLinearMethod(method = methodSelect.value) {
  return ["Gauss Elimination", "Gauss-Jordan", "Cramer-Rule", "LU-Decomposition"].includes(method);
}

// Append a line to the output console and keep the latest line visible.
function log(message = "") {
  output.textContent += `${message}\n`;
  output.scrollTop = output.scrollHeight;
}

// Clear the solver output area.
function clearOutput() {
  output.textContent = "";
}

// Escape user-provided text before injecting it into generated HTML.
function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// Build quick-insert buttons for common polynomial powers.
function renderPowerButtons(inputId) {
  return `
    <div class="power-row">
      <button type="button" class="power-button" data-target="${inputId}" data-insert="*x**2">x2</button>
      <button type="button" class="power-button" data-target="${inputId}" data-insert="*x**3">x3</button>
      <button type="button" class="power-button" data-target="${inputId}" data-insert="*x**4">x4</button>
      <button type="button" class="power-button" data-target="${inputId}" data-insert="*x**5">x5</button>
    </div>
  `;
}

// Rebuild the input section to match the currently selected method.
function renderDynamicFields() {
  rememberCurrentInputs();
  const method = methodSelect.value;
  const linear = isLinearMethod(method);

  criteriaSection.style.display = linear ? "none" : "block";
  solveBtn.textContent = "Solve";

  let html = `<p class="section-label">2. Input Parameters</p>`;

  if (method === "Bisection" || method === "False Position") {
    html += `
      <div class="field-grid">
        <label>
          <span>f(x)</span>
          <input id="equation" class="input-control" value="${escapeHtml(nonlinearDefaults.equation)}" placeholder="x**3 - x - 2">
        </label>
      </div>
      ${renderPowerButtons("equation")}
      <div class="field-grid two-up">
        <label>
          <span>Lower Guess (xl)</span>
          <input id="val1" class="input-control" type="number" step="any" value="${escapeHtml(nonlinearDefaults.val1)}">
        </label>
        <label>
          <span>Upper Guess (xu)</span>
          <input id="val2" class="input-control" type="number" step="any" value="${escapeHtml(nonlinearDefaults.val2)}">
        </label>
      </div>
    `;
  } else if (method === "Fixed Point") {
    html += `
      <div class="field-grid">
        <label>
          <span>g(x) (rearranged from f(x)=0)</span>
          <input id="equation" class="input-control" value="${escapeHtml(nonlinearDefaults.equation)}" placeholder="cos(x)">
        </label>
      </div>
      ${renderPowerButtons("equation")}
      <div class="field-grid">
        <label>
          <span>Initial Guess (x0)</span>
          <input id="val1" class="input-control" type="number" step="any" value="${escapeHtml(nonlinearDefaults.val1)}">
        </label>
      </div>
    `;
  } else if (method === "Newton-Raphson") {
    html += `
      <div class="field-grid">
        <label>
          <span>f(x)</span>
          <input id="equation" class="input-control" value="${escapeHtml(nonlinearDefaults.equation)}" placeholder="x**3 - x - 2">
        </label>
        ${renderPowerButtons("equation")}
        <label>
          <span>f'(x) (Derivative)</span>
          <input id="derivative" class="input-control" value="${escapeHtml(nonlinearDefaults.derivative)}" placeholder="3*x**2 - 1">
        </label>
      </div>
      <div class="field-grid">
        <label>
          <span>Initial Guess (x0)</span>
          <input id="val1" class="input-control" type="number" step="any" value="${escapeHtml(nonlinearDefaults.val1)}">
        </label>
      </div>
    `;
  } else if (method === "Secant") {
    html += `
      <div class="field-grid">
        <label>
          <span>f(x)</span>
          <input id="equation" class="input-control" value="${escapeHtml(nonlinearDefaults.equation)}" placeholder="x**3 - x - 2">
        </label>
      </div>
      ${renderPowerButtons("equation")}
      <div class="field-grid two-up">
        <label>
          <span>Guess 1 (xi-1)</span>
          <input id="val1" class="input-control" type="number" step="any" value="${escapeHtml(nonlinearDefaults.val1)}">
        </label>
        <label>
          <span>Guess 2 (xi)</span>
          <input id="val2" class="input-control" type="number" step="any" value="${escapeHtml(nonlinearDefaults.val2)}">
        </label>
      </div>
    `;
  } else if (linear) {
    html += `
      <div class="field-grid">
        <label>
          <span>Number of Equations</span>
          <input id="system-size" class="input-control" type="number" min="1" step="1" value="${escapeHtml(linearDefaults.systemSize)}">
        </label>
        <p class="card-note">Enter one equation per line using x1, x2, x3 ... Example: 2x1 - 3x2 + x3 = 5</p>
        <label>
          <span>System Equations</span>
          <textarea id="system-equations" class="equation-box" placeholder="2x1 - 3x2 = 5&#10;4x1 + x2 = 6">${escapeHtml(linearDefaults.equations)}</textarea>
        </label>
      </div>
    `;
  }

  dynamicFields.innerHTML = html;
}

// Insert generated text at the current cursor position inside a field.
function insertIntoInput(targetId, text) {
  const input = document.getElementById(targetId);
  if (!input) {
    return;
  }

  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;
  input.value = `${input.value.slice(0, start)}${text}${input.value.slice(end)}`;
  input.focus();
  const nextPos = start + text.length;
  input.setSelectionRange(nextPos, nextPos);
}

// Normalize user expressions into JavaScript-friendly math syntax.
function preprocessExpression(expression) {
  let expr = expression.trim().replaceAll("^", "**");
  expr = expr.replace(/\bpi\b/gi, "Math.PI");
  expr = expr.replace(/\be\b/g, "Math.E");
  expr = expr.replace(/\bsin\s*\(/gi, "Math.sin(");
  expr = expr.replace(/\bcos\s*\(/gi, "Math.cos(");
  expr = expr.replace(/\btan\s*\(/gi, "Math.tan(");
  expr = expr.replace(/\bexp\s*\(/gi, "Math.exp(");
  expr = expr.replace(/\blog\s*\(/gi, "Math.log(");
  expr = expr.replace(/\bsqrt\s*\(/gi, "Math.sqrt(");
  return expr;
}

// Compile a validated expression string into a callable function of x.
function compileExpression(expression) {
  const prepared = preprocessExpression(expression);
  const validChars = /^[0-9xX+\-*/().,\sA-Za-z_*]+$/;
  if (!prepared || !validChars.test(prepared)) {
    throw new Error("Invalid equation syntax.");
  }

  const fn = new Function("x", `"use strict"; return (${prepared});`);
  return (x) => {
    const value = fn(x);
    if (!Number.isFinite(value)) {
      throw new Error("Equation evaluation produced a non-finite result.");
    }
    return value;
  };
}

// Format numeric output consistently in solver logs.
function formatNumber(value, digits = 6) {
  return Number.isFinite(value) ? value.toFixed(digits) : String(value);
}

// Parse text equations into matrix form for linear-system methods.
function parseLinearSystem(rawEquations, size) {
  const equations = rawEquations
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (equations.length !== size) {
    throw new Error(`Expected ${size} equations, but received ${equations.length}.`);
  }

  const variables = Array.from({ length: size }, (_, index) => `x${index + 1}`);
  const coeffPattern = /([+-])(\d*\.?\d*)(x\d+)/g;
  const matrixA = Array.from({ length: size }, () => Array(size).fill(0));
  const vectorB = Array(size).fill(0);

  equations.forEach((equation, rowIndex) => {
    if (!equation.includes("=")) {
      throw new Error(`Equation ${rowIndex + 1} is missing '='.`);
    }

    const [lhsRaw, rhsRaw] = equation.split("=");
    const rhs = Number.parseFloat(rhsRaw.trim());
    if (!Number.isFinite(rhs)) {
      throw new Error(`Right-hand side of equation ${rowIndex + 1} must be numeric.`);
    }
    vectorB[rowIndex] = rhs;

    let lhs = lhsRaw.replaceAll(" ", "").replaceAll("*", "");
    if (!lhs.startsWith("+") && !lhs.startsWith("-")) {
      lhs = `+${lhs}`;
    }

    let position = 0;
    let foundTerm = false;
    coeffPattern.lastIndex = 0;

    for (const match of lhs.matchAll(coeffPattern)) {
      if (match.index !== position) {
        throw new Error(`Could not parse equation ${rowIndex + 1}. Use terms like 2x1 - 3x2 + x3.`);
      }

      const [, sign, number, variable] = match;
      if (!variables.includes(variable)) {
        throw new Error(`Use only variables from ${variables.join(", ")}.`);
      }

      let coefficient = number === "" ? 1 : Number.parseFloat(number);
      if (sign === "-") {
        coefficient *= -1;
      }

      matrixA[rowIndex][variables.indexOf(variable)] += coefficient;
      position = match.index + match[0].length;
      foundTerm = true;
    }

    if (!foundTerm || position !== lhs.length) {
      throw new Error(`Could not parse equation ${rowIndex + 1}. Use terms like 2x1 - 3x2 + x3.`);
    }
  });

  return { matrixA, vectorB, variables };
}

// Convert vectors and matrices into readable multiline strings.
function matrixToString(matrix) {
  if (!Array.isArray(matrix[0])) {
    return `[${matrix.map((value) => formatNumber(value)).join(", ")}]`;
  }
  return matrix
    .map((row) => `[${row.map((value) => formatNumber(value)).join(", ")}]`)
    .join("\n");
}

// Create a shallow row-by-row copy of a matrix.
function cloneMatrix(matrix) {
  return matrix.map((row) => [...row]);
}

// Compute a determinant using elimination with partial pivoting.
function determinant(matrix) {
  const n = matrix.length;
  const work = cloneMatrix(matrix);
  let det = 1;
  let sign = 1;

  for (let i = 0; i < n; i += 1) {
    let pivot = i;
    for (let row = i + 1; row < n; row += 1) {
      if (Math.abs(work[row][i]) > Math.abs(work[pivot][i])) {
        pivot = row;
      }
    }

    if (Math.abs(work[pivot][i]) < 1e-12) {
      return 0;
    }

    if (pivot !== i) {
      [work[i], work[pivot]] = [work[pivot], work[i]];
      sign *= -1;
    }

    det *= work[i][i];
    for (let row = i + 1; row < n; row += 1) {
      const factor = work[row][i] / work[i][i];
      for (let col = i; col < n; col += 1) {
        work[row][col] -= factor * work[i][col];
      }
    }
  }

  return det * sign;
}

// Main solve entry point that routes to linear or nonlinear handlers.
function solve() {
  clearOutput();

  const method = methodSelect.value;

  try {
    if (isLinearMethod(method)) {
      solveLinear(method);
    } else {
      solveNonlinear(method);
    }
  } catch (error) {
    log(`CRITICAL ERROR:\n${error.message}\nCheck equation syntax. For multiplication, use forms like 2*x.`);
  }
}

// Collect inputs and dispatch the selected nonlinear root-finding method.
function solveNonlinear(method) {
  const equation = document.getElementById("equation")?.value.trim() ?? "";
  if (!equation) {
    throw new Error("Equation field cannot be empty.");
  }

  const es = Number.parseFloat(document.getElementById("es").value);
  const maxIter = Number.parseInt(document.getElementById("iterations").value, 10);
  const val1 = Number.parseFloat(document.getElementById("val1").value);
  const val2Raw = document.getElementById("val2");
  const val2 = val2Raw ? Number.parseFloat(val2Raw.value) : 0;

  if (!Number.isFinite(es) || !Number.isFinite(maxIter) || !Number.isFinite(val1) || (val2Raw && !Number.isFinite(val2))) {
    throw new Error("Please provide valid numeric inputs.");
  }

  const fn = compileExpression(equation);
  log(`--- Solving using ${method} ---`);
  log(`Equation: ${preprocessExpression(equation)}`);
  log("");

  if (method === "Bisection") {
    runBisection(fn, equation, val1, val2, es, maxIter);
  } else if (method === "Fixed Point") {
    runFixedPoint(fn, equation, val1, es, maxIter);
  } else if (method === "False Position") {
    runFalsePosition(fn, equation, val1, val2, es, maxIter);
  } else if (method === "Newton-Raphson") {
    const derivativeText = document.getElementById("derivative").value.trim();
    if (!derivativeText) {
      throw new Error("Derivative field cannot be empty.");
    }
    const derivative = compileExpression(derivativeText);
    runNewton(fn, derivative, equation, val1, es, maxIter);
  } else if (method === "Secant") {
    runSecant(fn, equation, val1, val2, es, maxIter);
  }
}

// Collect inputs and dispatch the selected linear-system method.
function solveLinear(method) {
  const systemSize = Number.parseInt(document.getElementById("system-size").value, 10);
  const equations = document.getElementById("system-equations").value;
  if (!Number.isInteger(systemSize) || systemSize <= 0) {
    throw new Error("Number of equations must be a positive integer.");
  }

  const { matrixA, vectorB, variables } = parseLinearSystem(equations, systemSize);
  log(`--- Solving using ${method} ---`);
  log(`Variables order: ${variables.join(", ")}`);
  log("Coefficient Matrix A:");
  log(matrixToString(matrixA));
  log("Constants Vector b:");
  log(matrixToString(vectorB));
  log("");

  if (method === "Gauss Elimination") {
    runGaussElimination(matrixA, vectorB, variables);
  } else if (method === "Gauss-Jordan") {
    runGaussJordan(matrixA, vectorB, variables);
  } else if (method === "Cramer-Rule") {
    runCramers(matrixA, vectorB, variables);
  } else if (method === "LU-Decomposition") {
    runLuPivot(matrixA, vectorB, variables);
  }

}

// Solve for a root using the bisection method.
function runBisection(fn, equation, xl, xu, es, maxIter) {
  if (fn(xl) * fn(xu) >= 0) {
    log("Error: f(xl) and f(xu) must have opposite signs.");
    return;
  }

  log(`${"Iter".padEnd(6)} ${"xl".padEnd(12)} ${"xu".padEnd(12)} ${"xr".padEnd(12)} ${"f(xr)".padEnd(14)} ${"ea (%)".padEnd(10)}`);
  log("-".repeat(70));

  let xr = null;
  let xrOld = null;
  for (let i = 1; i <= maxIter; i += 1) {
    xrOld = xr;
    xr = (xl + xu) / 2;
    const fl = fn(xl);
    const fxr = fn(xr);
    const ea = xrOld !== null && xr !== 0 ? Math.abs((xr - xrOld) / xr) * 100 : 0;

    log(`${String(i).padEnd(6)} ${formatNumber(xl).padEnd(12)} ${formatNumber(xu).padEnd(12)} ${formatNumber(xr).padEnd(12)} ${formatNumber(fxr).padEnd(14)} ${formatNumber(ea).padEnd(10)}`);

    if (ea !== 0 && ea < es) {
      log("-".repeat(70));
      log(`Converged: Root ~= ${formatNumber(xr)} after ${i} iterations`);
      return;
    }

    if (fl * fxr < 0) {
      xu = xr;
    } else {
      xl = xr;
    }
  }

  log("Max iterations reached.");
}

// Solve for a root using fixed-point iteration.
function runFixedPoint(gFunction, equation, x0, es, maxIter) {
  let xr = x0;
  log(`${"Iter".padEnd(8)} ${"x_old".padEnd(12)} ${"g(x_old)".padEnd(14)} ${"ea %".padEnd(12)}`);
  log("-".repeat(50));

  for (let i = 1; i <= maxIter; i += 1) {
    const xrOld = xr;
    xr = gFunction(xrOld);

    let ea;
    if (i > 1) {
      ea = xr !== 0 ? Math.abs((xr - xrOld) / xr) * 100 : Math.abs((xr - xrOld) / (xr + 1e-10)) * 100;
    } else {
      ea = 100;
    }

    log(`${String(i).padEnd(8)} ${formatNumber(xrOld).padEnd(12)} ${formatNumber(xr).padEnd(14)} ${ea.toFixed(4).padEnd(12)}`);

    if (i > 1 && ea < es) {
      log("-".repeat(50));
      log(`Converged! Root ~= ${xr.toFixed(8)} after ${i} iterations.`);
      return;
    }

    if (i > 10 && ea > 1000) {
      log("Method diverging! Error is growing.");
      return;
    }
  }

  log("Reached max iterations.");
}

// Solve for a root using the false-position method.
function runFalsePosition(fn, equation, xl, xu, es, maxIter) {
  if (fn(xl) * fn(xu) >= 0) {
    log("Error: f(xl) and f(xu) must have opposite signs.");
    return;
  }

  const xlInit = xl;
  const xuInit = xu;
  let xr = 0;
  log(`${"Iter".padEnd(8)} ${"xl".padEnd(10)} ${"xu".padEnd(10)} ${"xr".padEnd(10)} ${"f(xr)".padEnd(12)} ${"ea %".padEnd(10)}`);

  for (let i = 1; i <= maxIter; i += 1) {
    const xrOld = xr;
    const fl = fn(xl);
    const fu = fn(xu);
    xr = xu - (fu * (xl - xu)) / (fl - fu);
    const fxr = fn(xr);
    const ea = i > 1 && xr !== 0 ? Math.abs((xr - xrOld) / xr) * 100 : 0;

    log(`${String(i).padEnd(8)} ${xl.toFixed(4).padEnd(10)} ${xu.toFixed(4).padEnd(10)} ${xr.toFixed(4).padEnd(10)} ${fxr.toFixed(4).padEnd(12)} ${ea.toFixed(4).padEnd(10)}`);

    if (i > 1 && ea < es) {
      log(`Converged! Root: ${formatNumber(xr)} at ${i} iterations.`);
      return;
    }

    if (fl * fxr < 0) {
      xu = xr;
    } else {
      xl = xr;
    }
  }

  log("Reached max iterations.");
}

// Solve for a root using the Newton-Raphson method.
function runNewton(fn, derivative, equation, x0, es, maxIter) {
  let xr = x0;
  log(`${"Iter".padEnd(8)} ${"xi".padEnd(12)} ${"f(xi)".padEnd(12)} ${"f_prime(xi)".padEnd(12)} ${"ea %".padEnd(10)}`);

  for (let i = 1; i <= maxIter; i += 1) {
    const xrOld = xr;
    const fx = fn(xrOld);
    const dfx = derivative(xrOld);

    if (dfx === 0) {
      log("Derivative is zero. Newton-Raphson fails.");
      return;
    }

    xr = xrOld - fx / dfx;
    const ea = xr !== 0 ? Math.abs((xr - xrOld) / xr) * 100 : 0;
    log(`${String(i).padEnd(8)} ${formatNumber(xrOld).padEnd(12)} ${formatNumber(fx).padEnd(12)} ${formatNumber(dfx).padEnd(12)} ${ea.toFixed(4).padEnd(10)}`);

    if (ea < es) {
      log(`Converged! Root: ${formatNumber(xr)} at ${i} iterations.`);
      return;
    }
  }

  log("Reached max iterations.");
}

// Solve for a root using the secant method.
function runSecant(fn, equation, xMinus1, x0, es, maxIter) {
  let xiMinus1 = xMinus1;
  let xi = x0;
  log(`${"Iter".padEnd(8)} ${"xi-1".padEnd(12)} ${"xi".padEnd(12)} ${"f(xi)".padEnd(12)} ${"ea %".padEnd(10)}`);

  for (let i = 1; i <= maxIter; i += 1) {
    const fXi = fn(xi);
    const fXiMinus1 = fn(xiMinus1);

    if (fXi - fXiMinus1 === 0) {
      log("Division by zero error.");
      return;
    }

    const xiPlus1 = xi - (fXi * (xi - xiMinus1)) / (fXi - fXiMinus1);
    const ea = xiPlus1 !== 0 ? Math.abs((xiPlus1 - xi) / xiPlus1) * 100 : 0;

    log(`${String(i).padEnd(8)} ${formatNumber(xiMinus1).padEnd(12)} ${formatNumber(xi).padEnd(12)} ${formatNumber(fXi).padEnd(12)} ${ea.toFixed(4).padEnd(10)}`);

    if (ea < es) {
      log(`Converged! Root: ${formatNumber(xiPlus1)} at ${i} iterations.`);
      return;
    }

    xiMinus1 = xi;
    xi = xiPlus1;
  }

  log("Reached max iterations.");
}

// Solve a linear system using Gaussian elimination and back substitution.
function runGaussElimination(matrixA, vectorB, variables) {
  const n = vectorB.length;
  const augmented = matrixA.map((row, index) => [...row, vectorB[index]]);

  log("Forward Elimination:");
  for (let i = 0; i < n; i += 1) {
    let pivotRow = i;
    for (let row = i + 1; row < n; row += 1) {
      if (Math.abs(augmented[row][i]) > Math.abs(augmented[pivotRow][i])) {
        pivotRow = row;
      }
    }

    if (Math.abs(augmented[pivotRow][i]) < 1e-12) {
      throw new Error("The system has no unique solution.");
    }

    if (pivotRow !== i) {
      [augmented[i], augmented[pivotRow]] = [augmented[pivotRow], augmented[i]];
      log(`Swapped row ${i + 1} with row ${pivotRow + 1}`);
    }

    for (let row = i + 1; row < n; row += 1) {
      const factor = augmented[row][i] / augmented[i][i];
      for (let col = i; col <= n; col += 1) {
        augmented[row][col] -= factor * augmented[i][col];
      }
      augmented[row][i] = 0;
    }

    log(`After pivot step ${i + 1}:`);
    log(matrixToString(augmented));
  }

  const solution = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i -= 1) {
    let rhs = augmented[i][n];
    for (let col = i + 1; col < n; col += 1) {
      rhs -= augmented[i][col] * solution[col];
    }
    solution[i] = rhs / augmented[i][i];
  }

  log("");
  log("Upper Triangular Matrix:");
  log(matrixToString(augmented.map((row) => row.slice(0, -1))));
  log("Updated Constants:");
  log(matrixToString(augmented.map((row) => row[row.length - 1])));
  log("Solution:");
  variables.forEach((variable, index) => log(`${variable} = ${formatNumber(solution[index])}`));
}

// Solve a linear system using Gauss-Jordan elimination.
function runGaussJordan(matrixA, vectorB, variables) {
  const n = vectorB.length;
  const augmented = matrixA.map((row, index) => [...row, vectorB[index]]);

  log("Gauss-Jordan Elimination:");
  for (let i = 0; i < n; i += 1) {
    let pivotRow = i;
    for (let row = i + 1; row < n; row += 1) {
      if (Math.abs(augmented[row][i]) > Math.abs(augmented[pivotRow][i])) {
        pivotRow = row;
      }
    }

    if (Math.abs(augmented[pivotRow][i]) < 1e-12) {
      throw new Error("The system has no unique solution.");
    }

    if (pivotRow !== i) {
      [augmented[i], augmented[pivotRow]] = [augmented[pivotRow], augmented[i]];
      log(`Swapped row ${i + 1} with row ${pivotRow + 1}`);
    }

    const pivot = augmented[i][i];
    for (let col = i; col <= n; col += 1) {
      augmented[i][col] /= pivot;
    }

    for (let row = 0; row < n; row += 1) {
      if (row === i) {
        continue;
      }
      const factor = augmented[row][i];
      for (let col = i; col <= n; col += 1) {
        augmented[row][col] -= factor * augmented[i][col];
      }
      augmented[row][i] = 0;
    }

    log(`After pivot step ${i + 1}:`);
    log(matrixToString(augmented));
  }

  log("");
  log("Reduced Row Echelon Form:");
  log(matrixToString(augmented.map((row) => row.slice(0, -1))));
  log("Solution:");
  variables.forEach((variable, index) => log(`${variable} = ${formatNumber(augmented[index][augmented[index].length - 1])}`));
}

// Solve a linear system using Cramer's Rule determinants.
function runCramers(matrixA, vectorB, variables) {
  const det = determinant(matrixA);
  if (Math.abs(det) < 1e-12) {
    throw new Error("Cramer's Rule requires a non-zero determinant.");
  }

  log(`D = ${formatNumber(det)}`);
  log("");

  variables.forEach((variable, index) => {
    const replaced = cloneMatrix(matrixA);
    replaced.forEach((row, rowIndex) => {
      row[index] = vectorB[rowIndex];
    });
    const detI = determinant(replaced);
    log(`D_${index + 1} = ${formatNumber(detI)}`);
    log(`${variable} = ${formatNumber(detI / det)}`);
  });
}

// Solve a linear system using LU decomposition with partial pivoting.
function runLuPivot(matrixA, vectorB, variables) {
  const n = vectorB.length;
  const matrixL = Array.from({ length: n }, () => Array(n).fill(0));
  const matrixU = cloneMatrix(matrixA);
  const matrixP = Array.from({ length: n }, (_, row) =>
    Array.from({ length: n }, (_, col) => (row === col ? 1 : 0))
  );

  log("LU Decomposition with Partial Pivoting:");
  for (let i = 0; i < n; i += 1) {
    let pivot = i;
    for (let row = i + 1; row < n; row += 1) {
      if (Math.abs(matrixU[row][i]) > Math.abs(matrixU[pivot][i])) {
        pivot = row;
      }
    }

    if (Math.abs(matrixU[pivot][i]) < 1e-12) {
      throw new Error("The system has no unique solution.");
    }

    if (pivot !== i) {
      [matrixU[i], matrixU[pivot]] = [matrixU[pivot], matrixU[i]];
      [matrixP[i], matrixP[pivot]] = [matrixP[pivot], matrixP[i]];
      if (i > 0) {
        for (let col = 0; col < i; col += 1) {
          [matrixL[i][col], matrixL[pivot][col]] = [matrixL[pivot][col], matrixL[i][col]];
        }
      }
      log(`Swapped row ${i + 1} with row ${pivot + 1}`);
    }

    matrixL[i][i] = 1;
    for (let row = i + 1; row < n; row += 1) {
      const factor = matrixU[row][i] / matrixU[i][i];
      matrixL[row][i] = factor;
      for (let col = i; col < n; col += 1) {
        matrixU[row][col] -= factor * matrixU[i][col];
      }
      matrixU[row][i] = 0;
    }
  }

  const pb = matrixP.map((row) => row.reduce((sum, value, index) => sum + value * vectorB[index], 0));
  const y = Array(n).fill(0);
  for (let i = 0; i < n; i += 1) {
    let value = pb[i];
    for (let col = 0; col < i; col += 1) {
      value -= matrixL[i][col] * y[col];
    }
    y[i] = value;
  }

  const solution = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i -= 1) {
    let value = y[i];
    for (let col = i + 1; col < n; col += 1) {
      value -= matrixU[i][col] * solution[col];
    }
    solution[i] = value / matrixU[i][i];
  }

  log("P Matrix:");
  log(matrixToString(matrixP));
  log("L Matrix:");
  log(matrixToString(matrixL));
  log("U Matrix:");
  log(matrixToString(matrixU));
  log("Solution:");
  variables.forEach((variable, index) => log(`${variable} = ${formatNumber(solution[index])}`));
}

// Reset stored inputs and rebuild the form with default values.
function clearInputs() {
  nonlinearDefaults.equation = "";
  nonlinearDefaults.derivative = "";
  nonlinearDefaults.val1 = "";
  nonlinearDefaults.val2 = "";
  nonlinearDefaults.es = "0.01";
  nonlinearDefaults.iterations = "50";
  linearDefaults.systemSize = "2";
  linearDefaults.equations = "";

  document.getElementById("es").value = nonlinearDefaults.es;
  document.getElementById("iterations").value = nonlinearDefaults.iterations;
  renderDynamicFields();
}

// Initialize the UI and wire up user interactions.
methodSelect.innerHTML = methods.map((method) => `<option value="${method}">${method}</option>`).join("");
methodSelect.addEventListener("change", renderDynamicFields);
solveBtn.addEventListener("click", solve);
clearInputsBtn.addEventListener("click", clearInputs);
clearOutputBtn.addEventListener("click", clearOutput);
dynamicFields.addEventListener("click", (event) => {
  const button = event.target.closest(".power-button");
  if (!button) {
    return;
  }
  insertIntoInput(button.dataset.target, button.dataset.insert);
});
dynamicFields.addEventListener("input", rememberCurrentInputs);

renderDynamicFields();
