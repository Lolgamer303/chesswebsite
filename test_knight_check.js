// Quick test to verify knight check detection
// This is a temporary test file

const testKnightCheck = () => {
    // Simulated knight position and king position
    const knightRow = 2, knightCol = 1;
    const kingRow = 0, kingCol = 0;
    
    // Knight attack pattern test
    const rowDiff = Math.abs(knightRow - kingRow);
    const colDiff = Math.abs(knightCol - kingCol);
    const canAttack = (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
    
    console.log(`Knight at (${knightRow}, ${knightCol}) can attack King at (${kingRow}, ${kingCol}): ${canAttack}`);
    
    // Test the specific case: knight at b3 (row 2, col 1) can attack king at a1 (row 0, col 0)
    // rowDiff = 2, colDiff = 1 - this should return true
    
    return canAttack;
};

// Run the test
testKnightCheck();
