let gameState = {
    t1: { score: 0, frames: Array(10).fill().map(() => ({ t1: null, t2: null, t3: null, score: null })), currentFrame: 0, currentThrow: 1, finished: false },
    t2: { score: 0, frames: Array(10).fill().map(() => ({ t1: null, t2: null, t3: null, score: null })), currentFrame: 0, currentThrow: 1, finished: false }
};

function initScoreboard() {
    const renderFrames = (teamId) => {
        let html = '';
        for(let i=0; i<10; i++) {
            let throwsHtml = i === 9 
                ? `<div class="throw-box" id="${teamId}-f${i}-t1"></div><div class="throw-box" id="${teamId}-f${i}-t2"></div><div class="throw-box" id="${teamId}-f${i}-t3"></div>`
                : `<div class="throw-box" id="${teamId}-f${i}-t1"></div><div class="throw-box" id="${teamId}-f${i}-t2"></div>`;
                
            html += `<div class="frame">
                <div class="frame-header">${i+1}</div>
                <div class="frame-throws">${throwsHtml}</div>
                <div class="frame-score" id="${teamId}-f${i}-score"></div>
            </div>`;
        }
        return html;
    };
    
    document.getElementById('cyan-frames').innerHTML = renderFrames('t1');
    document.getElementById('red-frames').innerHTML = renderFrames('t2');
}

function showBanner(text, typeClass) {
    let banner = document.getElementById('announce-banner');
    let bannerText = document.getElementById('announce-text');
    bannerText.textContent = text;
    bannerText.className = typeClass;
    banner.classList.add('show');
    setTimeout(() => banner.classList.remove('show'), 2000);
}

function calculateScores(teamKey) {
    let state = gameState[teamKey];
    let total = 0;
    
    for(let i=0; i<10; i++) {
        let f = state.frames[i];
        if (f.t1 === null) break;
        
        let frameScore = (f.t1 === 'X' ? 10 : f.t1) + (f.t2 === '/' ? (10 - f.t1) : (f.t2 === 'X' ? 10 : (f.t2 || 0))) + (f.t3 === 'X' ? 10 : (f.t3 || 0));
        
        if (i < 9) {
            if (f.t1 === 'X') {
                let nextF = state.frames[i+1];
                if (nextF.t1 !== null) {
                    frameScore += (nextF.t1 === 'X' ? 10 : nextF.t1);
                    if (nextF.t1 === 'X') {
                        if (i < 8) {
                            let nextNextF = state.frames[i+2];
                            if (nextNextF.t1 !== null) frameScore += (nextNextF.t1 === 'X' ? 10 : nextNextF.t1);
                        } else {
                            if (nextF.t2 !== null) frameScore += (nextF.t2 === 'X' ? 10 : nextF.t2);
                        }
                    } else if (nextF.t2 !== null) {
                        frameScore += (nextF.t2 === '/' ? (10 - nextF.t1) : nextF.t2);
                    }
                }
            } else if (f.t2 === '/') {
                let nextF = state.frames[i+1];
                if (nextF.t1 !== null) {
                    frameScore += (nextF.t1 === 'X' ? 10 : nextF.t1);
                }
            }
        }
        total += frameScore;
        f.score = total;
    }
    state.score = total;
}

function updateScoreUI() {
    ['t1', 't2'].forEach(teamKey => {
        let state = gameState[teamKey];
        document.getElementById(teamKey === 't1' ? 'cyan-total' : 'red-total').textContent = state.score;
        
        for(let i=0; i<10; i++) {
            let f = state.frames[i];
            document.getElementById(`${teamKey}-f${i}-t1`).innerHTML = f.t1 !== null ? f.t1 : '';
            document.getElementById(`${teamKey}-f${i}-t2`).innerHTML = f.t2 !== null ? f.t2 : '';
            if (i === 9) document.getElementById(`${teamKey}-f${i}-t3`).innerHTML = f.t3 !== null ? f.t3 : '';
            document.getElementById(`${teamKey}-f${i}-score`).innerHTML = f.score !== null ? f.score : '';
        }
    });
}

function processThrow(team, remainingPinsCount) {
    let teamKey = team === 1 ? 't1' : 't2';
    let state = gameState[teamKey];
    
    if (state.finished) return { action: 'none' };
    
    let f = state.frames[state.currentFrame];
    let knockedDown = 10 - remainingPinsCount;
    
    let result = { action: 'none' };

    if (state.currentFrame < 9) {
        if (state.currentThrow === 1) {
            if (knockedDown === 10) {
                f.t1 = 'X';
                showBanner('STRIKE!', 'strike-text');
                state.currentFrame++;
                state.currentThrow = 1;
                result = { action: 'reset' };
            } else {
                f.t1 = knockedDown;
                state.currentThrow = 2;
                result = { action: 'sweep' };
            }
        } else {
            if (remainingPinsCount === 0) {
                f.t2 = '/';
                showBanner('SPARE!', 'spare-text');
            } else {
                f.t2 = 10 - remainingPinsCount - f.t1;
            }
            state.currentFrame++;
            state.currentThrow = 1;
            result = { action: 'reset' };
        }
    } else {
        if (state.currentThrow === 1) {
            if (knockedDown === 10) {
                f.t1 = 'X';
                showBanner('STRIKE!', 'strike-text');
                state.currentThrow = 2;
                result = { action: 'reset' };
            } else {
                f.t1 = knockedDown;
                state.currentThrow = 2;
                result = { action: 'sweep' };
            }
        } else if (state.currentThrow === 2) {
            if (f.t1 === 'X') {
                if (remainingPinsCount === 0) {
                    f.t2 = 'X';
                    showBanner('STRIKE!', 'strike-text');
                    state.currentThrow = 3;
                    result = { action: 'reset' };
                } else {
                    f.t2 = 10 - remainingPinsCount;
                    state.currentThrow = 3;
                    result = { action: 'sweep' };
                }
            } else {
                if (remainingPinsCount === 0) {
                    f.t2 = '/';
                    showBanner('SPARE!', 'spare-text');
                    state.currentThrow = 3;
                    result = { action: 'reset' };
                } else {
                    f.t2 = 10 - remainingPinsCount - f.t1;
                    state.finished = true;
                    result = { action: 'end' };
                }
            }
        } else {
            if (f.t2 === 'X' || f.t2 === '/') {
                if (remainingPinsCount === 0) f.t3 = 'X';
                else f.t3 = 10 - remainingPinsCount - (f.t2 === 'X' ? 0 : 10);
            } else {
                f.t3 = 10 - remainingPinsCount;
            }
            state.finished = true;
            result = { action: 'end' };
        }
    }

    calculateScores(teamKey);
    updateScoreUI();

    if (state.finished) {
        setTimeout(() => showBanner(`GAME OVER!`, 'open-text'), 2500);
    }

    return result;
}

initScoreboard();