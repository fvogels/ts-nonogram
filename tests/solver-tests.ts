/* tslint:disable */

import { expect } from 'chai';
import { Square, compatibleSequences, endOfLine, space, spaces, block, blocks, refine } from '@/solver';
import { List } from 'immutable';



function parse(s: string) : List<Square>
{
    return List(s.split('').map(parseChar));


    function parseChar(char : string) : Square
    {
        if ( char === '.' )
        {
            return Square.Empty;
        }
        else if ( char === '?' )
        {
            return Square.Unknown;
        }
        else if ( char === '!' )
        {
            return Square.Impossible;
        }
        else
        {
            return Square.Filled;
        }
    }
}


describe('endOfLine', function () {
    it('returns nothing when given nonempty sequence', function () {
        const result = [...endOfLine(List(parse('.')))]

        expect(result).to.be.empty;
    });

    it('returns empty list when given empty sequence', function () {
        const result = [...endOfLine(List())]

        expect(result).to.have.length(1);
        expect(result[0].toArray()).to.eql([]);
    });
});

describe('space', function () {
    it('adds space on "."', function () {
        const result = [...space( endOfLine )(parse('.'))];
        const expected = parse('.');

        expect(result).to.have.length(1);
        expect(result[0].equals(expected)).to.be.true;
    });

    it('adds space on "?"', function () {
        const result = [...space( endOfLine )(parse('?'))];
        const expected = parse('.');

        expect(result).to.have.length(1);
        expect(result[0].equals(expected)).to.be.true;
    });

    it('fails on "x"', function () {
        const result = [...space( endOfLine )(parse('x'))];

        expect(result).to.be.empty;
    });

    it('space(space(eol)) adds two spaces on ..', function () {
        const result = [...space(space(endOfLine))(parse('..'))];
        const expected = parse('..');

        expect(result).to.have.length(1);
        expect(result[0].equals(expected)).to.be.true;
    });

    it('space(space(eol)) adds two spaces on ?.', function () {
        const result = [...space(space(endOfLine))(parse('?.'))];
        const expected = parse('..');

        expect(result).to.have.length(1);
        expect(result[0].equals(expected)).to.be.true;
    });

    it('space(space(eol)) fails on .x', function () {
        const result = [...space(space(endOfLine))(parse('.x'))];
        const expected = parse('..');

        expect(result).to.be.empty;
    });
});

describe('spaces', function () {
    it('works on .', function () {
        const result = [...spaces(0, endOfLine)(parse('.'))];
        const expected = parse('.');

        expect(result).to.have.length(1);
        expect(result[0].equals(expected)).to.be.true;
    });

    it('works on ..', function () {
        const result = [...spaces(0, endOfLine)(parse('..'))];
        const expected = parse('..');

        expect(result).to.have.length(1);
        expect(result[0].equals(expected)).to.be.true;
    });

    it('works on ?', function () {
        const result = [...spaces(0, endOfLine)(parse('?'))];
        const expected = parse('.');

        expect(result).to.have.length(1);
        expect(result[0].equals(expected)).to.be.true;
    });

    it('works on .?.', function () {
        const result = [...spaces(0, endOfLine)(parse('.?.'))];
        const expected = parse('...');

        expect(result).to.have.length(1);
        expect(result[0].equals(expected)).to.be.true;
    });

    it('fails on .x.', function () {
        const result = [...spaces(0, endOfLine)(parse('.x.'))];

        expect(result).to.be.empty;
    });
});

describe('block', function () {
    it('adds block on "x"', function () {
        const result = [...block( endOfLine )(parse('x'))];
        const expected = parse('x');

        expect(result).to.have.length(1);
        expect(result[0].equals(expected)).to.be.true;
    });

    it('adds block on "?"', function () {
        const result = [...block( endOfLine )(parse('?'))];
        const expected = parse('x');

        expect(result).to.have.length(1);
        expect(result[0].equals(expected)).to.be.true;
    });

    it('fails on "x"', function () {
        const result = [...block( endOfLine )(parse('.'))];

        expect(result).to.be.empty;
    });
});

describe('blocks', function () {
    it('length 1, compatible with x', function () {
        const result = [...blocks(1, endOfLine)(parse('x'))];
        const expected = parse('x');

        expect(result).to.have.length(1);
        expect(result[0].equals(expected)).to.be.true;
    });

    it('length 1, compatible with ?', function () {
        const result = [...blocks(1, endOfLine)(parse('?'))];
        const expected = parse('x');

        expect(result).to.have.length(1);
        expect(result[0].equals(expected)).to.be.true;
    });

    it('length 2, compatible with xx', function () {
        const result = [...blocks(2, endOfLine)(parse('xx'))];
        const expected = parse('xx');

        expect(result).to.have.length(1);
        expect(result[0].equals(expected)).to.be.true;
    });

    it('length 2, compatible with ??', function () {
        const result = [...blocks(2, endOfLine)(parse('??'))];
        const expected = parse('xx');

        expect(result).to.have.length(1);
        expect(result[0].equals(expected)).to.be.true;
    });

    it('fails: length 2, compatible with ..', function () {
        const result = [...blocks(1, endOfLine)(parse('..'))];

        expect(result).to.be.empty;
    });
});

describe('compatibleSequences', function () {
    const inputs : { constraints : number[], compatibleWith : string, expected : string[] }[] = [
        {
            constraints: [],
            compatibleWith: '?',
            expected: [
                '.'
            ]
        },
        {
            constraints: [],
            compatibleWith: '.',
            expected: [
                '.'
            ]
        },
        {
            constraints: [],
            compatibleWith: '..',
            expected: [
                '..'
            ]
        },
        {
            constraints: [],
            compatibleWith: '???',
            expected: [
                '...'
            ]
        },
        {
            constraints: [1],
            compatibleWith: '?',
            expected: [
                'x'
            ]
        },
        {
            constraints: [1],
            compatibleWith: 'x',
            expected: [
                'x'
            ]
        },
        {
            constraints: [1],
            compatibleWith: '.',
            expected: [
            ]
        },
        {
            constraints: [1],
            compatibleWith: '??',
            expected: [
                'x.',
                '.x'
            ]
        },
        {
            constraints: [2],
            compatibleWith: '??',
            expected: [
                'xx',
            ]
        },
        {
            constraints: [1, 1],
            compatibleWith: '??',
            expected: [
            ]
        },
        {
            constraints: [1, 1],
            compatibleWith: '???',
            expected: [
                'x.x'
            ]
        },
        {
            constraints: [1, 1],
            compatibleWith: '????',
            expected: [
                'x.x.',
                'x..x',
                '.x.x',
            ]
        },
        {
            constraints: [1, 1, 1],
            compatibleWith: '????',
            expected: [
            ]
        },
        {
            constraints: [1, 1, 1],
            compatibleWith: '?????',
            expected: [
                'x.x.x'
            ]
        },
    ];

    inputs.forEach( ({ constraints, compatibleWith, expected: expectedStrings }) => {
        it(`Constraints [${constraints}], compatibleWith ${compatibleWith}`, function () {
            const seq = parse(compatibleWith);
            const expected = expectedStrings.map(x => parse(x).toArray());
            const actual = [...compatibleSequences(seq, constraints)].map(x => [...x]);

            expect(actual).to.have.same.deep.members(expected);
        });
    } );
});

describe('refine', function () {
    const data : { sequence: string, constraints: readonly number[], expected: string }[] = [
        {
            sequence: '?',
            constraints: [],
            expected: '.'
        },
        {
            sequence: '?',
            constraints: [1],
            expected: 'x'
        },
        {
            sequence: '.',
            constraints: [],
            expected: '.'
        },
        {
            sequence: 'x',
            constraints: [],
            expected: '!'
        },
        {
            sequence: '??',
            constraints: [1],
            expected: '??'
        },
        {
            sequence: '?.',
            constraints: [1],
            expected: 'x.'
        },
        {
            sequence: '???',
            constraints: [1],
            expected: '???'
        },
        {
            sequence: '???',
            constraints: [1,1],
            expected: 'x.x'
        },
        {
            sequence: '?x?',
            constraints: [1],
            expected: '.x.'
        },
        {
            sequence: '..?',
            constraints: [1],
            expected: '..x'
        },
        {
            sequence: '????',
            constraints: [3],
            expected: '?xx?'
        },
        {
            sequence: '??????????',
            constraints: [8],
            expected: '??xxxxxx??'
        },
        {
            sequence: '??????????',
            constraints: [4,4],
            expected: '?xxx??xxx?'
        },
    ];

    data.forEach(({sequence: sequenceString, constraints, expected: expectedString}) => {
        it(`${sequenceString} with constraints [${constraints}]`, function () {
            const sequence = parse(sequenceString);
            const expected = parse(expectedString);
            const actual = refine(sequence, constraints);

            expect([...actual]).to.be.eql([...expected]);
        });
    });
});
