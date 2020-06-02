import { Seq, Repeat, List } from 'immutable';


export enum Square
{
    Empty,
    Filled,
    Unknown,
    Impossible
}

export function compatibleSequences(compatibleWith : List<Square>, constraints : readonly number[]) : Iterable<List<Square>>
{
    return parseConstraints(constraints, 0)(compatibleWith);
}


type Continuation =  (compatibleWith : List<Square>) => Iterable<List<Square>>;

function compatible(square1 : Square, square2 : Square) : boolean
{
    return square1 === square2 || square1 === Square.Unknown || square2 === Square.Unknown;
}

function parseConstraints(constraints : readonly number[], minimalSpaces : number) : Continuation
{
    if ( constraints.length === 0 )
    {
        return spaces(0, endOfLine);
    }
    else
    {
        const [c, ...cs] = constraints;

        return spaces(minimalSpaces, blocks(c, parseConstraints(cs, 1)));
    }
}

export function* endOfLine(compatibleWith : List<Square>) : Iterable<List<Square>>
{
    if ( compatibleWith.size === 0 )
    {
        yield List<Square>();
    }
}

export function spaces(minimumNumberOfSpaces : number, continuation : Continuation) : Continuation
{
    if ( minimumNumberOfSpaces > 0 )
    {
        return space(spaces(minimumNumberOfSpaces - 1, continuation));
    }
    else
    {
        return alternatives(
            continuation,
            space(cw => spaces(0, continuation)(cw))
        )
    }
}

export function alternatives(...continuations : Continuation[]) : Continuation
{
    return function* (compatibleWith : List<Square>) {
        for ( const continuation of continuations )
        {
            yield* continuation(compatibleWith);
        }
    };
}

export function blocks(nBlocks : number, continuation : Continuation) : Continuation
{
    if ( nBlocks > 0 )
    {
        return block(cw => blocks(nBlocks - 1, continuation)(cw));
    }
    else
    {
        return continuation;
    }
}

export function space(continuation : Continuation) : Continuation
{
    return prepend(Square.Empty, continuation);
}

export function block(continuation : Continuation) : Continuation
{
    return prepend(Square.Filled, continuation);
}

export function prepend(square : Square, continuation : Continuation) : Continuation
{
    return function* (compatibleWith : List<Square>) {
        if ( !compatibleWith.isEmpty() && compatible(compatibleWith.first(), square) )
        {
            for ( const seq of continuation(compatibleWith.shift()) )
            {
                yield seq.unshift(square);
            }
        }
    };
}

export function merge(sequence1 : List<Square>, sequence2 : List<Square>) : List<Square>
{
    return sequence1.zip(sequence2).map(mergeSquares);


    function mergeSquares([square1, square2] : [Square, Square]) : Square
    {
        if ( square1 === square2 )
        {
            return square1;
        }
        if ( square1 === Square.Impossible )
        {
            return square2;
        }
        else if ( square2 === Square.Impossible )
        {
            return square1;
        }
        else
        {
            return Square.Unknown;
        }
    }
}

export function refine(sequence : List<Square>, constraints : readonly number[]) : List<Square>
{
    let result = sequence.map(_ => Square.Impossible);

    for ( const seq of compatibleSequences(sequence, constraints) )
    {
        result = merge(result, seq);
    }

    return result;
}