import React from 'react';
import {ARI, ATL, BAL, BOS, CHC, CHW, CIN, CLE, COL, DET, HOU, KAN, LAA, LAD, MIA, MIL, MIN, NYM, NYY, OAK, PHI, PIT, SD, SF, SEA, STL, TB, TEX, TOR, WAS} from '../assets/Icons';

interface TeamWithLogoProps {
  teamName: string;
  size?: number;
  showName?: boolean;
}

const teamNameToAbbreviation = (teamName: string, size: number = 30): React.ReactNode => {
  // Map of team names to their abbreviations
  const teamMap: Record<string, React.ReactNode> = {
    'Diamondbacks': <ARI size={size} />,
    'Braves': <ATL size={size} />,
    'Orioles': <BAL size={size} />,
    'Red Sox': <BOS size={size} />,
    'Cubs': <CHC size={size} />,
    'White Sox': <CHW size={size} />,
    'Reds': <CIN size={size} />,
    'Guardians': <CLE size={size} />,
    'Rockies': <COL size={size} />,
    'Tigers': <DET size={size} />,
    'Astros': <HOU size={size} />,
    'Royals': <KAN size={size} />,
    'Angels': <LAA size={size} />,
    'Dodgers': <LAD size={size} />,
    'Marlins': <MIA size={size} />,
    'Brewers': <MIL size={size} />,
    'Twins': <MIN size={size} />,
    'Mets': <NYM size={size} />,
    'Yankees': <NYY size={size} />,
    'Athletics': <OAK size={size} />,
    'Phillies': <PHI size={size} />,
    'Pirates': <PIT size={size} />,
    'Padres': <SD size={size} />,
    'Giants': <SF size={size} />,
    'Mariners': <SEA size={size} />,
    'Cardinals': <STL size={size} />,
    'Rays': <TB size={size} />,
    'Rangers': <TEX size={size} />,
    'Blue Jays': <TOR size={size} />,
    'Nationals': <WAS size={size} />,
  };

  // Return the abbreviation if found, otherwise return the original name
  return teamMap[teamName] || teamName;
};

const TeamWithLogo: React.FC<TeamWithLogoProps> = ({ teamName, size = 100, showName = true }) => {
  const abbreviation = teamNameToAbbreviation(teamName, size);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      {abbreviation}
      {showName && <span style={{ fontFamily: 'cursive', fontSize: '1rem' }}>{teamName}</span>}
    </div>
  );
};

export default TeamWithLogo;




