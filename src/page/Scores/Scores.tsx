import Navbar from '../../components/Navbar/Navbar';
import { useEffect, useState } from 'react';
import { YahtzeeAPI } from '../../api/YahtzeeAPI';
import './Scores.css';
import { ScoreDetails } from '../../modals/ScoreDetails/ScoreDetails';

export function Scores() {

    const { getScores } = YahtzeeAPI();
    const [playersScore, setPlayersScore] = useState<Record<'daily' | 'weekly' | 'monthly' | 'lifetime', any>>({daily: [], weekly: [], monthly: [], lifetime: []});
    const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
    const [detailsIndex, setDetailsIndex] = useState<number>(-1);
    const [period, setPeriod] = useState<number>(() => {
        return parseInt(localStorage.getItem("selectedPeriod") || "3");  // Default to "lifetime"
    });
    const [filteredScores, setFilteredScores] = useState<{Icon: string, Nom: string, Score: number, Date: string, Details: any}[]>([]);

    const fetchScores = async () => {
        try {
            let response = await getScores();
            console.log("scores demandés: " + response)
            if (response) {
                setPlayersScore(response);
                setFilteredScores(response.lifetime);
                console.log("scores reçus: " + playersScore)
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        localStorage.setItem("selectedPeriod", period.toString());
    }, [period]);

    useEffect(() => {
        fetchScores();
    }, []);

    useEffect(() => {
        const periods = ['daily', 'weekly', 'monthly', 'lifetime'] as const;
        setFilteredScores(playersScore[periods[period]]);
    }, [period, playersScore]);

    useEffect(() => {
        if (period === 0) {
            setFilteredScores(playersScore.daily);
        } else if (period === 1) {
            setFilteredScores(playersScore.weekly);
        } else if (period === 2) {
            setFilteredScores(playersScore.monthly);
        } else if (period === 3) {
            setFilteredScores(playersScore.lifetime);
        }
    }, [period]);

    const openDetails = (index: number) => {
        setDetailsOpen(true);
        setDetailsIndex(index);
        document.body.classList.add('modal-open'); 
    }

    const closeDetails = () => {
        setDetailsOpen(false);
        document.body.classList.remove('modal-open');
    };

    return (
        <div className="fullPage">
            <Navbar/>
            <div className={`container ${detailsOpen ? 'blur-background' : ''}`}>
                <div className="selector">
                    <button className="scoreButton" onClick={() => setPeriod(0)} disabled={period == 0}>Daily</button>
                    <button className="scoreButton" onClick={() => setPeriod(1)} disabled={period == 1}>Weekly</button>
                    <button className="scoreButton" onClick={() => setPeriod(2)} disabled={period == 2}>Monthly</button>
                    <button className="scoreButton" onClick={() => setPeriod(3)} disabled={period == 3}>Lifetime</button>
                </div>
                    {filteredScores.length > 0 && (
                        <div className="podiums">
                            <div className="podium podiumSecond">
                                {filteredScores[1] && (
                                    <div className="step">
                                        2
                                        <div className="head">
                                            <img src={filteredScores[1].Icon} alt="2nd" className="podiumIcon"/>
                                            <div className="name">{filteredScores[1].Nom}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="podium podiumFirst">
                                {filteredScores[0] && (
                                    <div className="step">
                                        1
                                        <div className="head">
                                            <img src={filteredScores[0].Icon} alt="1st" className="podiumIcon"/>
                                            <div className="name">{filteredScores[0].Nom}</div>
                                        </div>
                                        
                                    </div>
                                )}
                            </div>
                            <div className="podium podiumThird">
                                {filteredScores[2] && (
                                    <div className="step">
                                        3
                                        <div className="head">
                                            <img src={filteredScores[2].Icon} alt="3rd" className="podiumIcon"/>
                                            <div className="name">{filteredScores[2].Nom}</div>
                                        </div>
                                        
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                <div className="tab">
                    <table className="scoreTableau" style={{borderCollapse: 'collapse'}}>
                        { filteredScores.length > 0 && (
                        <thead>
                            <tr>
                                <th style={{fontWeight: 'bold'}}>icon</th>
                                <th style={{fontWeight: 'bold'}}>name</th>
                                <th style={{fontWeight: 'bold'}}>score</th>
                                <th style={{fontWeight: 'bold'}}>date</th>
                            </tr>
                        </thead> ) }
                        <tbody>
                        {filteredScores.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', fontWeight: 'bold', padding: '20px', color: 'red' }}>
                                    <p>no score available :(</p>
                                </td>
                            </tr>
                        ) : (
                            filteredScores.map((player, index) => {
                                const textColor = index === 0 ? 
                                                    {color: 'rgb(186, 160, 16)', fontWeight: 'bold'} : 
                                                    index === 1 ?
                                                        {color: 'rgb(85, 81, 81)', fontWeight: 'bold'} : 
                                                        index === 2 ? 
                                                            {color: 'rgb(108, 68, 28)', fontWeight: 'bold'} :
                                                            {color: 'black'}

                                const backgroundColor = index === 0 ? 
                                                    {backgroundColor: 'rgba(255,215,0,0.8)'} : 
                                                    index === 1 ?
                                                        {backgroundColor: 'rgba(192,192,192,0.8)'} : 
                                                        index === 2 ? 
                                                            {backgroundColor: 'rgba(205,127,50,0.8)'} :
                                                            {backgroundColor: 'white'}
        
                                return (
                                <tr key={index} style={ backgroundColor } >
                                    <td style={{border: '1px solid lightgray', textAlign: 'center'}}>
                                        <img src={player.Icon} alt="Player Icon" style={{ width: "30px", height: "30px" }} />
                                    </td>
                                    <td style={{border: '1px solid lightgray', textAlign: 'center', ...textColor}}>{player.Nom}</td>
                                    <td style={{border: '1px solid lightgray', textAlign: 'center'}}>{player.Score}</td>
                                    <td style={{border: '1px solid lightgray', textAlign: 'center'}}>{player.Date}</td>
                                    <td style={{border: '1px solid lightgray', textAlign: 'center'}}>
                                        <img src="/dices/eye.png" alt="details" style={{ width: "30px", height: "30px", verticalAlign: 'text-top' }} onClick={() => {openDetails(index)}} />
                                    </td>
                                </tr>
                            )})
                        )}
                        </tbody>
                    </table>
                </div>
                <button className="scoreButton" style={{ marginTop: '5%'}}onClick={fetchScores}> Refresh </button>
            </div>
            <div>
                { detailsOpen && (
                    <div className="modal-overlay">
                        <ScoreDetails closeFunction={() => closeDetails()} playerDetails={filteredScores[detailsIndex]} />
                    </div>
                )}
            </div>
        </div>
    )
};