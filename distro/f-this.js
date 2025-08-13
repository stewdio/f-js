

/*


Notes / caveats

- Named ƒ forms are emitted as const declarations. Use them only where declarations are legal (e.g., at top level or inside blocks, not inside object literals or class bodies). If you need let/var, you can change decl in fThis to suit.
- Arrow semantics apply (lexical this, no arguments, not constructible).
- The transformer skips strings, comments, and template literals and balances parentheses/braces, so it’s resilient to most real-world code.
- Semicolons are appended for named forms to avoid ASI edge-cases.
- Generators require function*; there’s no arrow-generator syntax. That’s why generator sugar outputs function* (or async function*), not arrows.
- The transformer still skips strings, comments, and template literals, and balances () / {}.
- async must appear immediately before ƒ (whitespace/newline allowed).
- Named forms emit const declarations; if you prefer let/var, change decl.

*/

// function fThis(src, { decl = "const" } = {}) {
function fThis(src, { decl = "var" } = {}) {
  const S = { CODE:0, SQ:1, DQ:2, LINE:3, BLOCK:4, TMP:5, TMPEXP:6 };
  let out = "", i = 0, n = src.length, state = S.CODE;

  const isWS = ch => /\s/.test(ch);
  const isIdStart = ch => ch && /[$_\p{ID_Start}]/u.test(ch);
  const isIdCont  = ch => ch && /[$_\u200C\u200D\p{ID_Continue}]/u.test(ch);

  // Recurse on substrings so nested ƒ get transformed too
  const rec = s => fThis(s, { decl });
  const cleanExpr = s => rec(s).replace(/\s*;+\s*$/, ""); // trim trailing ; in expression contexts
  const wrapAnon = s => `(${s})`; // anonymous results wrapped for safety

  function consumeTrailingAsync() {
    let p = out.length - 1;
    while (p >= 0 && /\s/.test(out[p])) p--;
    let word = "";
    while (p >= 0 && /[$\w\u200C\u200D]/.test(out[p])) { word = out[p] + word; p--; }
    if (word === "async") {
      while (p >= 0 && /\s/.test(out[p])) p--;
      out = out.slice(0, p + 1);
      return true;
    }
    return false;
  }

  function readIdentifier(start) {
    let j = start;
    if (!isIdStart(src[j])) return null;
    j++;
    while (j < n && isIdCont(src[j])) j++;
    return { name: src.slice(start, j), end: j - 1 };
  }

  function readBalanced(startIdx, open, close) {
    let p = startIdx, st = S.CODE, depth = 0;
    while (p < n) {
      const c = src[p], c2 = src[p + 1];
      if (st === S.CODE) {
        if (c === open) depth++;
        else if (c === close) { depth--; if (depth === 0) return { end: p, text: src.slice(startIdx + 1, p) }; }
        if (c === "'") st = S.SQ;
        else if (c === '"') st = S.DQ;
        else if (c === "`") st = S.TMP;
        else if (c === "/" && c2 === "/") { st = S.LINE; p++; }
        else if (c === "/" && c2 === "*") { st = S.BLOCK; p++; }
      } else if (st === S.SQ) { if (c === "\\") p++; else if (c === "'") st = S.CODE; }
      else if (st === S.DQ)  { if (c === "\\") p++; else if (c === '"') st = S.CODE; }
      else if (st === S.LINE){ if (c === "\n") st = S.CODE; }
      else if (st === S.BLOCK){ if (c === "*" && c2 === "/") { st = S.CODE; p++; } }
      else if (st === S.TMP) {
        if (c === "\\") p++;
        else if (c === "`") st = S.CODE;
        else if (c === "$" && c2 === "{") { st = S.TMPEXP; p++; }
      } else if (st === S.TMPEXP) {
        if (c === "'") st = S.SQ;
        else if (c === '"') st = S.DQ;
        else if (c === "`") st = S.TMP;
        else if (c === "}") st = S.TMP;
      }
      p++;
    }
    return null;
  }

  // Read an expression until a top-level ',', ')' or ';'
  function readExpression(startIdx) {
    let p = startIdx, st = S.CODE;
    let paren = 0, brace = 0, bracket = 0;
    while (p < n) {
      const c = src[p], c2 = src[p + 1];
      if (st === S.CODE) {
        if (c === "(") { paren++; p++; continue; }
        if (c === ")") { if (!paren && !brace && !bracket) return { end: p - 1, text: src.slice(startIdx, p).trimEnd() }; paren--; p++; continue; }
        if (c === "{") { brace++; p++; continue; }
        if (c === "}") { if (!brace && !paren && !bracket) return { end: p - 1, text: src.slice(startIdx, p).trimEnd() }; brace--; p++; continue; }
        if (c === "[") { bracket++; p++; continue; }
        if (c === "]") { if (!bracket && !paren && !brace) return { end: p - 1, text: src.slice(startIdx, p).trimEnd() }; bracket--; p++; continue; }
        if (!paren && !brace && !bracket && (c === "," || c === ";")) return { end: p - 1, text: src.slice(startIdx, p).trimEnd() };
        if (c === "'") { st = S.SQ; p++; continue; }
        if (c === '"') { st = S.DQ; p++; continue; }
        if (c === "`") { st = S.TMP; p++; continue; }
        if (c === "/" && c2 === "/") { st = S.LINE; p += 2; continue; }
        if (c === "/" && c2 === "*") { st = S.BLOCK; p += 2; continue; }
        p++; continue;
      }
      if (st === S.SQ)   { if (c === "\\") p += 2; else { if (c === "'") st = S.CODE, p++; else p++; } continue; }
      if (st === S.DQ)   { if (c === "\\") p += 2; else { if (c === '"') st = S.CODE, p++; else p++; } continue; }
      if (st === S.LINE) { if (c === "\n") st = S.CODE; p++; continue; }
      if (st === S.BLOCK){ if (c === "*" && c2 === "/") { st = S.CODE; p += 2; } else p++; continue; }
      if (st === S.TMP)  { if (c === "\\") { p += 2; continue; } if (c === "`") { st = S.CODE; p++; continue; } if (c === "$" && c2 === "{") { st = S.TMPEXP; p += 2; continue; } p++; continue; }
      if (st === S.TMPEXP){ if (c === "'") { st = S.SQ; p++; continue; } if (c === '"') { st = S.DQ; p++; continue; } if (c === "`") { st = S.TMP; p++; continue; } if (c === "}") { st = S.TMP; p++; continue; } p++; continue; }
    }
    return { end: n - 1, text: src.slice(startIdx).trimEnd() };
  }

  while (i < n) {
    const c = src[i], c2 = src[i + 1];

    if (state === S.CODE) {
      if (c === "'") { state = S.SQ; out += c; i++; continue; }
      if (c === '"') { state = S.DQ; out += c; i++; continue; }
      if (c === "`") { state = S.TMP; out += c; i++; continue; }
      if (c === "/" && c2 === "/") { state = S.LINE; out += "//"; i += 2; continue; }
      if (c === "/" && c2 === "*") { state = S.BLOCK; out += "/*"; i += 2; continue; }

      if (c === "ƒ") {
        const isAsync = consumeTrailingAsync();

        // optional ws, optional '*'
        let j = i + 1;
        while (j < n && isWS(src[j])) j++;
        const isGen = src[j] === "*";
        if (isGen) { j++; while (j < n && isWS(src[j])) j++; }

        // Named forms
        const id = readIdentifier(j);
        if (id) {
          let k = id.end + 1;
          while (k < n && isWS(src[k])) k++;

          if (src[k] === "(") {
            const args = readBalanced(k, "(", ")");
            if (args) {
              let m = args.end + 1;
              while (m < n && isWS(src[m])) m++;

              if (src[m] === "{") {
                const body = readBalanced(m, "{", "}");
                if (body) {
                  const bodyT = rec(body.text);
                  if (isGen) out += `${decl} ${id.name} = ${isAsync ? "async " : ""}function* (${args.text}) {${bodyT}};`;
                  else       out += `${decl} ${id.name} = ${isAsync ? "async " : ""}(${args.text}) => {${bodyT}};`;
                  i = body.end + 1; continue;
                }
              } else if (!isGen) {
                const expr = readExpression(m);
                const exprT = cleanExpr(expr.text);
                out += `${decl} ${id.name} = ${isAsync ? "async " : ""}(${args.text}) => ${exprT};`;
                i = expr.end + 1; continue;
              }
            }
          } else if (src[k] === "{") {
            const body = readBalanced(k, "{", "}");
            if (body) {
              const bodyT = rec(body.text);
              if (isGen) out += `${decl} ${id.name} = ${isAsync ? "async " : ""}function* () {${bodyT}};`;
              else       out += `${decl} ${id.name} = ${isAsync ? "async " : ""}() => {${bodyT}};`;
              i = body.end + 1; continue;
            }
          } else if (!isGen) {
            const expr = readExpression(k);
            const exprT = cleanExpr(expr.text);
            out += `${decl} ${id.name} = ${isAsync ? "async " : ""}() => ${exprT};`;
            i = expr.end + 1; continue;
          }

          if (isAsync) out += "async ";
          out += c; i++; continue;
        }

        // Anonymous forms
        if (src[j] === "(") {
          const args = readBalanced(j, "(", ")");
          if (args) {
            let m = args.end + 1;
            while (m < n && isWS(src[m])) m++;
            if (src[m] === "{") {
              const body = readBalanced(m, "{", "}");
              if (body) {
                const bodyT = rec(body.text);
                const expr = isGen
                  ? `${isAsync ? "async " : ""}function* (${args.text}) {${bodyT}}`
                  : `${isAsync ? "async " : ""}(${args.text}) => {${bodyT}}`;
                out += wrapAnon(expr);
                i = body.end + 1; continue;
              }
            } else if (!isGen) {
              const exprBody = readExpression(m);
              const exprT = cleanExpr(exprBody.text);
              const expr = `${isAsync ? "async " : ""}(${args.text}) => ${exprT}`;
              out += wrapAnon(expr);
              i = exprBody.end + 1; continue;
            }
          }
        } else if (src[j] === "{") {
          const body = readBalanced(j, "{", "}");
          if (body) {
            const bodyT = rec(body.text);
            const expr = isGen
              ? `${isAsync ? "async " : ""}function* () {${bodyT}}`
              : `${isAsync ? "async " : ""}() => {${bodyT}}`;
            out += wrapAnon(expr);
            i = body.end + 1; continue;
          }
        } else if (!isGen) {
          const exprBody = readExpression(j);
          const exprT = cleanExpr(exprBody.text);
          const expr = `${isAsync ? "async " : ""}() => ${exprT}`;
          out += wrapAnon(expr);
          i = exprBody.end + 1; continue;
        }

        if (isAsync) out += "async ";
        out += c; i++; continue;
      }

      out += c; i++; continue;
    }

    // passthrough for non-code states
    if (state === S.SQ)   { out += c; if (c === "\\") { out += src[i+1]||""; i+=2; } else { if (c === "'") { state=S.CODE; i++; } else i++; } continue; }
    if (state === S.DQ)   { out += c; if (c === "\\") { out += src[i+1]||""; i+=2; } else { if (c === '"') { state=S.CODE; i++; } else i++; } continue; }
    if (state === S.LINE) { out += c; if (c === "\n") state=S.CODE; i++; continue; }
    if (state === S.BLOCK){ out += c; if (c === "*" && c2 === "/") { out += "/"; i+=2; state=S.CODE; } else i++; continue; }
    if (state === S.TMP)  { out += c; if (c === "\\") { out += src[i+1]||""; i+=2; continue; } if (c === "`") { state = S.CODE; i++; continue; } if (c === "$" && c2 === "{") { out += "{"; i += 2; state = S.TMPEXP; continue; } i++; continue; }
    if (state === S.TMPEXP){ out += c; if (c === "}") { state = S.TMP; i++; continue; } if (c === "'") { state = S.SQ; i++; continue; } if (c === '"') { state = S.DQ; i++; continue; } if (c === "`") { state = S.TMP; i++; continue; } i++; continue; }
  }
  return out;
}

export default fThis