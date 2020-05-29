/* tslint:disable */

import { expect } from 'chai';
import { sequencesSatisfyingConstraints, Square } from '@/solver';


describe(`sequencesSatisfyingConstraints`, function() {
    const inputs : { length: number, constraints : number[], expected : string[] }[] = [
        {
            length: 0,
            constraints: [],
            expected: [ "" ]
        },
        {
            length: 1,
            constraints: [],
            expected: [ "." ]
        },
        {
            length: 2,
            constraints: [],
            expected: [ ".." ]
        },
        {
            length: 1,
            constraints: [1],
            expected: [ "x" ]
        },
        {
            length: 2,
            constraints: [1],
            expected: [ "x.", ".x" ]
        },
        {
            length: 3,
            constraints: [1],
            expected: [ "..x", ".x.", "x.." ]
        },
        {
            length: 2,
            constraints: [2],
            expected: [ "xx" ]
        },
        {
            length: 3,
            constraints: [1, 1],
            expected: [ "x.x" ]
        },
        {
            length: 2,
            constraints: [3],
            expected: [ ]
        },
        {
            length: 3,
            constraints: [2],
            expected: [ "xx.", ".xx" ]
        },
        {
            length: 4,
            constraints: [1, 1],
            expected: [ "x..x", "x.x.", ".x.x" ]
        },
        {
            length: 4,
            constraints: [1, 2],
            expected: [ "x.xx" ]
        },
        {
            length: 5,
            constraints: [1, 2],
            expected: [ "x.xx.", "x..xx", ".x.xx" ]
        },
        {
            length: 4,
            constraints: [4],
            expected: [ "xxxx" ]
        },
    ];

    inputs.forEach(function ({length, constraints, expected: expectedStrings}) {
        const expected = expectedStrings.map(parse);

        it(`length ${length}, constraints [${constraints}]`, function() {
            const actual = [...sequencesSatisfyingConstraints(length, constraints)];

            expect(actual.length).to.be.equal(expected.length);
            expect(actual).to.have.same.deep.members(expected);
        });
    });

    it('runs within time limits', function () {
        [...sequencesSatisfyingConstraints(40, [1, 1, 1, 1, 1])];
    });

    function parse(s: string) : Square[]
    {
        return s.split('').map(c => c === '.' ? Square.Empty : Square.Filled);
    }
});
