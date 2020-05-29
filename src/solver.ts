import { Repeat, Seq, Range } from 'immutable';


export enum Square
{
    Empty,
    Filled,
    Unknown
}


export function* sequencesSatisfyingConstraints(length : number, constraints : readonly number[], needsSpace : boolean = false) : Iterable<Seq.Indexed<Square>>
{
    if ( length >= 0 )
    {
        if ( constraints.length === 0 )
        {
            yield Repeat(Square.Empty, length);
        }
        else
        {
            const [ c, ...cs ] = constraints;
            const island = Repeat(Square.Filled, c);

            for ( const nSpaces of Range(needsSpace ? 1 : 0, length) )
            {
                const space = Repeat(Square.Empty, nSpaces);

                for ( const rest of sequencesSatisfyingConstraints(length - nSpaces - c, cs, true) )
                {
                    const concatenation : Seq.Indexed<Square> = space.concat<Square>(island, rest);

                    yield concatenation;
                }
            }
        }
    }
}
