var term = { 
    print:function(sz) { print(sz); },
    blue:function(sz) { print("\033[22;34m" + sz); },
    normal:function(sz) { print("\033[22;37m" + sz); },
    yellow:function(sz) { print("\033[01;33m" + sz); }
};

var test = {
    pc:0,
    fc:0,
    
    pass:function(expr, expected, result) {
        ++this.pc;
        term.blue("expr:" + expr + "\toracle:" + expected + "\tbig:" + result);
    },
    fail:function(expr, expected, result) {
        ++this.fc
        term.yellow("expr:" + expr + "\toracle:" + expected + "\tbig:" + result);
    }
};

term.blue("**** differential.rhino.js ****");

term.normal("Loading Big.no_closure.js");
load("Big.no_closure.js");
term.normal("Loaded.");

function oracle(expr, type) {
    try {
        var opts = { output:"" };
    
        var retcode = runCommand("./apcalc.wrapper.sh", expr, opts);

        if (retcode) {
            print("bc returned fail, expr: \"" + expr + "\"");
        }

        if (type == "boolean") {
            return !!(opts.output * 1);
        }
        else if (type == "number") {
            return new Big(opts.output).toString();
        }
    }
    catch(exc) {
        term.yellow("Exception thrown from apcalc: \"" + exc + "\"");
    }
}

function random() {
    var 
        wl = Math.floor(Math.random() * 8 + 1),
        fl = Math.floor(Math.random() * 8 + 1),
        res = "";
        
    for (var idx = 0; idx < wl; ++idx) {
        res += Math.floor(Math.random() * 9) + "";
    }
    
    res += ".";
        
    for (var idx = 0; idx < fl; ++idx) {
        res += Math.floor(Math.random() * 9) + "";
    }
    
    return res;
}

function addTest(l, r) {
    var 
        bl = new Big(l),
        br = new Big(r),
        expression = l + " + " + r,
        expected = oracle(expression, "number"),
        result = bl.plus(br);
    if (expected == result + "") {
        test.pass(expression, expected, result);
    }
    else {
        test.fail(expression, expected, result);
    }
}

addTest(random(), random());

    
    