import { Seq, Repeat } from 'immutable';


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

            for ( let nSpaces = needsSpace ? 1 : 0; nSpaces < length; ++nSpaces )
            {
                const space = Repeat(Square.Empty, nSpaces);

                for ( const rest of sequencesSatisfyingConstraints(length - nSpaces - c, cs, true) )
                {
                    yield space.concat(island, rest);
                }
            }
        }
    }
}


// export function areSequencesCompatible(sequence1 : Square[], sequence2 : Square[]) : boolean
// {
//     return sequence1.length === sequence2.length && zip(sequence1, sequence2).every([x, y] => x === y || x === Square.Unknown || y === Square.Unknown);
// }