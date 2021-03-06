var 
    // Sign cosnstants.
    POSITIVE = false,
    NEGATIVE = true,
    
    // Comparison constants.
    GT = 0,
    LT = 1,
    EQ = 2;

// The Big constructor.
Big = function(src) {
    // Coalesce numbers to strings.
    if (typeof src == "number") {
        src = "" + src;
    }
    
    // Parse and load the string version.
    if (src.substring) {
        return lex(src);
    }
    
    // Load by parts.
    else {
        this.sign = arguments[0];
        this.exponent = arguments[1];
        this.mantissa = arguments[2];
        this.flags = arguments[3] || { };
        
        this.expr = this.toString();
    }
};

// Global constants.
Big.POSITIVE = POSITIVE;
Big.NEGATIVE = NEGATIVE;

Big.parse = function(str) {
    return new Big(str);
};

Big.precision = 20;

