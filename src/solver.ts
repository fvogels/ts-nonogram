import { times } from 'lodash';


export enum Square
{
    Empty,
    Filled,
    Unknown
}


export function* sequencesSatisfyingConstraints(length : number, constraints : readonly number[], needsSpace : boolean = false) : Iterable<Square[]>
{
    if ( length >= 0 )
    {
        if ( constraints.length === 0 )
        {
            yield times(length, _ => Square.Empty);
        }
        else
        {
            const [ c, ...cs ] = constraints;
            const island = times(c, _ => Square.Filled);

            for ( let nSpaces = needsSpace ? 1 : 0; nSpaces < length; ++nSpaces )
            {
                const space = times(nSpaces, _ => Square.Empty);

                for ( const rest of sequencesSatisfyingConstraints(length - nSpaces - c, cs, true) )
                {
                    yield [ ...space, ...island, ...rest ];
                }
            }
        }
    }
}

