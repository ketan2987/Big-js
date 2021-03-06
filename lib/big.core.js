// Parse a source string into a Big object:
function lex(src) {
    src = src.replace(/(^\s+)|(\s+$)/g, "");

    var 
        hasSign = /^[+-]/.test(src),
        hasDecimal = /^[+-]?\d*\.\d*$/.test(src),
        withoutSign = hasSign ? 
            src.slice(1) :
            src;
    
    return normalize(
        new Big(
            hasSign && src[0] == "-" ? 
                NEGATIVE : 
                POSITIVE,
                
            hasDecimal ? 
                withoutSign.indexOf(".") - 1 :
                withoutSign.length - 1,
                
            stringToMantissa(
                withoutSign.replace(".", "")
            )
        )
    );
}

// Central definition of zero
var zero = new Big(POSITIVE, 0, []);

// Do comparison on two bigs, returns a comparison constant:
function compare(bl, br) {
    
    bl = bl.clone();
    br = br.clone();
    
    if (bl.isZero() || br.isZero()) {
        if (bl.isZero() && br.isZero())             { return EQ; }
        
        else if (bl.isZero()) {
            if (br.sign == POSITIVE)                { return LT; }
            else /* (br.sign == POSITIVE) */        { return GT; }
        }

        else /* (br.isZero()) */ {
            if      (bl.sign == POSITIVE)           { return GT; }
            else /* (bl.sign == POSITIVE) */        { return LT; }
        }
    }

    else if (bl.sign != br.sign) {
        if      (bl.sign == POSITIVE)               { return GT; }
        else /* (bl.sign == NEGATIVE) */            { return LT; }
    }
    
    else if (bl.exponent != br.exponent) {
        if (bl.sign == POSITIVE) {
            if (bl.exponent > br.exponent)          { return GT; }
            else                                    { return LT; }
        }
        else {
            if (bl.exponent > br.exponent)          { return LT; }
            else                                    { return GT; }
        }
    }
    
    else {
        var same = sameExponent(bl, br);
    
        return bl.sign == POSITIVE ?
            compareMantissae(same.l.mantissa, same.r.mantissa) :
            compareMantissae(same.r.mantissa, same.l.mantissa);
    }
}

// Compare only mantissae, assuming they correspond to equal 
// exponents:
function compareMantissae(m1, m2) {
    m1 = m1.slice();
    m2 = m2.slice();

    if (!m2.length) {
        if (mantissaIsZero(m1)) { return EQ; }
        else                    { return GT; }
    }
    else if (!m1.length) {
        if (mantissaIsZero(m2)) { return EQ; }
        else                    { return LT; }
    }
    
    if (m1[0] > m2[0])          { return GT; }
    else if (m1[0] < m2[0])     { return LT; }
    
    return compareMantissae(m1.splice(1), m2.splice(1));
}

// Returns true or false for whether a mantissa is zero:
function mantissaIsZero(m) { 
    return /^0*$/.test(mantissaToString(m));
}

// Returns the whole component of a big number in a string of base 10.
function wholeString(b) {
    if (b.exponent < 0) { return "0"; }
    else {
        return padR(
            b.exponent + 1, 
            take(
                b.exponent + 1, 
                b.mantissa
            )
        ).join("");
    }
}

// Returns the fractional component of a big number in a string of base 10.
function fractionalString(b) {
    // At least part of the significand is whole:
    if (b.exponent >= 0) {
        
        // If the entire significand is whole:
        if (b.mantissa.length == b.exponent) {
            return "";
        }
        
        // Else at least part of the significand is fractional:
        else {
            var frac = trimR(
                drop(
                    b.exponent + 1, 
                    b.mantissa
                )
            );
        
            return (
                "." + 
                frac.join("")
            );
        }
    }
    
    // The exponent is negative. At least some left padding is needed:
    else {
        return (
            "." + 
            repeat(-b.exponent - 1, "0").join("") + 
            b.mantissa.join("")
        );
    }
}

// Trim zeroes from the left:
function trimL(m) {
    return stringToMantissa(
        mantissaToString(m).replace(/^0+/, "")
    );
}

// Trim zeroes from the right:
function trimR(m) {
    return stringToMantissa(
        mantissaToString(m).replace(/0+$/, "")
    );
}

function cons(elem, arr) { 
    return [elem].concat(arr);
}

function uncons(arr) {
    return {
        x:arr[0],
        xs:arr.slice(1)
    };
}

// Take first len elements of m:
function take(len, m) { return m.slice(0, len); }

// Drop first len elements of m:
function drop(len, m) { 
    if (len < 1)    { return m.slice(); }
    else            { return m.slice(len); }
}

// The final element of m:
function last(m) { return m[m.length - 1]; }

// The initial element of m:
function init(m) { return m.slice(0, m.length - 1); }

// Pad m with zeroes to the left UNTIL it is of length len:
function padL(len, m) {
    if (m.length < len) { return repeat(len - m.length, 0).concat(m); }
    else                { return m; }
}

// Pad m with zeroes to the right UNTIL it is of length len:
function padR(len, m) {
    if (m.length < len) { return m.concat(repeat(len - m.length, 0)); }
    else                { return m; }
}

// Returns an array of val len times:
function repeat(len, val) {
    if (len <= 0) { return []; }
    
    var result = new Array(len);
    for (var idx = 0; idx < len; ++idx) {
        result[idx] = val;
    }
    return result;
}

// Standard map function:
function map(fn, arr) {
    var result = new Array(arr.length);
    for (var idx = 0; idx < arr.length; ++idx) {
        result[idx] = fn(arr[idx]);
    }
    return result;
}

// See Haskell Prelude
function zipWith(a1, a2, fn) {
    var result = new Array(a1.length);
    for (var idx = 0; idx < a1.length; ++idx) {
        result[idx] = fn(a1[idx], a2[idx]);
    }
    return result;
}

// Converts a string to a mantissa array:
function stringToMantissa(sz) {
    return map(
        function(x) { return parseInt(x, 10); },
        sz.split("")
    );
}

// Joins a mantissa into a string of digits:
function mantissaToString(m) { return m.join(""); }

function mantissaToInt(m) { return parseInt(mantissaToString(m), 10); }

function intToMantissa(n) { 
    return map(
        function(d) { return parseInt(d, 10); },
        n.toString()
    );
}

// Counts the number of zeroes before the first nonzero digit.
function numberOfLeadingZeroes(m) {
    var 
        match = m.join("").match(/^(0+)[1-9]/);
        
    return match ?
        match[1].length :
        0;
}

// Counts the number of zeroes following the last nonzero digit.
function numberOfTrailingZeroes(m) {
    var 
        match = m.join("").match(/(0+)$/);
        
    return match ?
        match[1].length :
        0;
}

// Normalize the big until the mantissa has no leading 
// or trailing zeroes and adjust the radix.
function normalize(b) {
    if (mantissaIsZero(b.mantissa)) { return zero; }

    var 
        lz = numberOfLeadingZeroes(b.mantissa),
        tz = numberOfTrailingZeroes(b.mantissa);
    
    if (!b.mantissa.length)         { return new Big(b.sign, b.exponent, []); }
    else if (lz)                    { return new Big(
                                            b.sign, 
                                            b.exponent - lz, 
                                            trimR(drop(lz, b.mantissa))
                                        ); 
                                    }
                                    
    else if (tz)                   { return new Big(
                                            b.sign,
                                            b.exponent,
                                            trimR(b.mantissa)
                                        );
                                    }
    else                            { return b }
}

// Abnormalize the big by adding leading zeroes until the given exponent is met:
function abnormalize(exp, b) {
    return new Big(
        b.sign,
        exp,
        padL(
            (exp - b.exponent) + b.mantissa.length, 
            b.mantissa
        )
    );
}

// Returns a tuple of the arguments which 
// are guaranteed to have the same exponent:
function sameExponent(l, r) {
    if (l.exponent == r.exponent)       { return { l:l, r:r }; }
    else if (l.exponent < r.exponent)   { return { l:abnormalize(r.exponent, l), r:r }; }
    else  /*(l.exponent > r.exponent)*/ { return { l:l, r:abnormalize(l.exponent, r) }; }
}

// Right-Pads the mantissae until they are the same length.
// Returns a tuple of bigs.
function sameLength(l, r) {
    var 
        ll = l.mantissa.length, 
        rl = r.mantissa.length;
    
    if (ll == rl)           {   return { l:l, r:r }; }
    else if (ll < rl)       {   return { 
                                    l:new Big(  
                                        l.sign, 
                                        l.exponent,
                                        padR(rl, l.mantissa)
                                    ), 
                                    r:r 
                                }; 
                            }
    else /* (ll > rl) */    {   return { 
                                    l:l,
                                    r:new Big(  
                                        r.sign, 
                                        r.exponent,
                                        padR(ll, r.mantissa)
                                    )
                                }; 
                            }
}

// Convert both bigs so that they have the same
// exponents and mantissa lengths.
function preProcess(l, r) {
    var same = sameExponent(l, r);
    return sameLength(same.l, same.r);
}

function negate(b) {
    return new Big(
        !b.sign,
        b.exponent,
        b.mantissa
    );
}

function abs(b) {
    return new Big(
        POSITIVE,
        b.exponent,
        b.mantissa
    );
}


