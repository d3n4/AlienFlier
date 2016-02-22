/// <reference path="../../../typings/Crafty.d.ts"/>


Crafty.get(0).attach( Crafty.get(1) );

class Test<T> {
    get(num1: T): T {
        return num1;
    }
}


var a = new Test<number>();

a.get(12);
