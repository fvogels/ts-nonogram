export enum Square
{
    Empty,
    Filled,
    Unknown
}


function repeat<T>(value : T, n : number) : T[]
{
    const result = new Array<T>(n);

    for ( let i = 0; i !== result.length; ++i )
    {
        result[i] = value;
    }

    return result;
}

export function* sequencesSatisfyingConstraints(length : number, constraints : readonly number[], needsSpace : boolean = false) : Iterable<Square[]>
{
    if ( length >= 0 )
    {
        if ( constraints.length === 0 )
        {
            yield repeat(Square.Empty, length);
        }
        else
        {
            const [ c, ...cs ] = constraints;
            const island = repeat(Square.Filled, c);

            for ( let nSpaces = needsSpace ? 1 : 0; nSpaces < length; ++nSpaces )
            {
                const space = repeat(Square.Empty, nSpaces);

                for ( const rest of sequencesSatisfyingConstraints(length - nSpaces - c, cs, true) )
                {
                    yield [ ...space, ...island, ...rest ];
                }
            }
        }
    }
}
