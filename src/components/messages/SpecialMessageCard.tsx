import React, { useState, useEffect } from 'react';
import { EnhancedMessage, DuelChallengeMetadata, ClanInviteMetadata, ThreatMetadata, AllianceMetadata } from '@/types/messaging';
import { useGame } from '@/context/GameContext';
import { getDuelTimeRemaining, isDuelChallengeExpired } from '@/lib/messagingUtils';
import { 
  Swords, Shield, Skull, Users, CheckCircle, X, Clock, AlertTriangle
} from 'lucide-react';

interface SpecialMessageCardProps {
  message: EnhancedMessage;
  isOwn: boolean;
}

const SpecialMessageCard: React.FC<SpecialMessageCardProps> = ({ message, isOwn }) => {
  const { currentUser, acceptDuelChallenge, declineDuelChallenge, acceptClanInvite } = useGame();
  const [timeRemaining, setTimeRemaining] = useState('');
  
  // Update countdown for duel challenges
  useEffect(() => {
    if (message.type === 'duel_challenge' && message.metadata) {
      const metadata = message.metadata as DuelChallengeMetadata;
      if (metadata.status === 'pending' && !isDuelChallengeExpired(metadata.expiresAt)) {
        const updateTimer = () => {
          setTimeRemaining(getDuelTimeRemaining(metadata.expiresAt));
        };
        
        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        
        return () => clearInterval(interval);
      }
    }
  }, [message]);
  
  const handleAcceptDuel = () => {
    acceptDuelChallenge(message.id);
  };
  
  const handleDeclineDuel = () => {
    declineDuelChallenge(message.id);
  };
  
  const handleAcceptClanInvite = () => {
    acceptClanInvite(message.id);
  };
  
  // Duel Challenge Card
  if (message.type === 'duel_challenge' && message.metadata) {
    const metadata = message.metadata as DuelChallengeMetadata;
    const isExpired = isDuelChallengeExpired(metadata.expiresAt);
    const canRespond = !isOwn && metadata.status === 'pending' && !isExpired;
    
    return (
      <div 
        className="p-4 rounded-lg border max-w-[320px]"
        style={{
          background: 'var(--bg-elevated)',
          borderColor: 'var(--neon-red)',
          borderWidth: '1px'
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Swords size={20} style={{ color: 'var(--neon-red)' }} />
          <span className="font-bold text-sm" style={{ fontFamily: 'Orbitron', color: 'var(--neon-red)' }}>
            DUEL CHALLENGE
          </span>
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            <strong>Stakes:</strong> {metadata.stakes}
          </div>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            <strong>Rules:</strong> {metadata.rules || 'No special rules'}
          </div>
        </div>
        
        {metadata.status === 'pending' && !isExpired && (
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--neon-orange)' }}>
            <Clock size={12} />
            <span>Expires in {timeRemaining}</span>
          </div>
        )}
        
        {metadata.status === 'expired' && (
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            EXPIRED
          </div>
        )}
        
        {metadata.status === 'accepted' && (
          <div className="text-sm" style={{ color: 'var(--neon-green)' }}>
            ACCEPTED
          </div>
        )}
        
        {metadata.status === 'declined' && (
          <div className="text-sm" style={{ color: 'var(--neon-red)' }}>
            DECLINED
          </div>
        )}
        
        {isOwn && metadata.status === 'pending' && (
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Awaiting response...
          </div>
        )}
        
        {canRespond && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAcceptDuel}
              className="flex items-center gap-1 px-3 py-2 rounded text-xs font-bold"
              style={{
                background: 'var(--neon-green)20',
                border: '1px solid var(--neon-green)',
                color: 'var(--neon-green)',
                fontFamily: 'Rajdhani'
              }}
            >
              <CheckCircle size={14} />
              ACCEPT
            </button>
            <button
              onClick={handleDeclineDuel}
              className="flex items-center gap-1 px-3 py-2 rounded text-xs font-bold"
              style={{
                background: 'var(--neon-red)10',
                border: '1px solid var(--neon-red)',
                color: 'var(--neon-red)',
                fontFamily: 'Rajdhani'
              }}
            >
              <X size={14} />
              DECLINE
            </button>
          </div>
        )}
      </div>
    );
  }
  
  // Clan Invite Card
  if (message.type === 'clan_invite' && message.metadata) {
    const metadata = message.metadata as ClanInviteMetadata;
    const canRespond = !isOwn && metadata.status === 'pending';
    
    return (
      <div 
        className="p-4 rounded-lg border max-w-[320px]"
        style={{
          background: 'var(--bg-elevated)',
          borderColor: 'var(--neon-blue)',
          borderWidth: '1px'
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Shield size={20} style={{ color: 'var(--neon-blue)' }} />
          <span className="font-bold text-sm" style={{ fontFamily: 'Orbitron', color: 'var(--neon-blue)' }}>
            CLAN INVITE
          </span>
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            {metadata.clanName}
          </div>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Role: {metadata.role === 'officer' ? 'Officer' : 'Member'}
          </div>
        </div>
        
        {metadata.status === 'pending' && canRespond && (
          <div className="flex gap-2">
            <button
              onClick={handleAcceptClanInvite}
              className="flex items-center gap-1 px-3 py-2 rounded text-xs font-bold"
              style={{
                background: 'var(--neon-blue)20',
                border: '1px solid var(--neon-blue)',
                color: 'var(--neon-blue)',
                fontFamily: 'Rajdhani'
              }}
            >
              <CheckCircle size={14} />
              ACCEPT
            </button>
            <button
              className="flex items-center gap-1 px-3 py-2 rounded text-xs font-bold"
              style={{
                background: 'var(--neon-red)10',
                border: '1px solid var(--neon-red)',
                color: 'var(--neon-red)',
                fontFamily: 'Rajdhani'
              }}
            >
              <X size={14} />
              DECLINE
            </button>
          </div>
        )}
        
        {metadata.status === 'accepted' && (
          <div className="text-sm" style={{ color: 'var(--neon-green)' }}>
            ACCEPTED
          </div>
        )}
        
        {metadata.status === 'declined' && (
          <div className="text-sm" style={{ color: 'var(--neon-red)' }}>
            DECLINED
          </div>
        )}
        
        {isOwn && metadata.status === 'pending' && (
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Awaiting response...
          </div>
        )}
      </div>
    );
  }
  
  // Threat Card
  if (message.type === 'threat' && message.metadata) {
    const metadata = message.metadata as ThreatMetadata;
    
    return (
      <div 
        className="p-4 rounded-lg border max-w-[320px]"
        style={{
          background: 'rgba(255, 0, 60, 0.06)',
          borderColor: 'var(--neon-red)',
          borderWidth: '1px'
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Skull size={20} style={{ color: 'var(--neon-red)' }} />
          <span className="font-bold text-sm" style={{ fontFamily: 'Orbitron', color: 'var(--neon-red)' }}>
            THREAT
          </span>
          {metadata.severity === 'high' && (
            <AlertTriangle size={16} style={{ color: 'var(--neon-red)' }} />
          )}
        </div>
        
        <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
          {message.text}
        </div>
        
        {metadata.reported && (
          <div className="text-xs mt-2" style={{ color: 'var(--neon-green)' }}>
            ✓ Reported to moderators
          </div>
        )}
      </div>
    );
  }
  
  // Alliance Card
  if (message.type === 'alliance_proposal' && message.metadata) {
    const metadata = message.metadata as AllianceMetadata;
    const canRespond = !isOwn && metadata.status === 'pending';
    
    return (
      <div 
        className="p-4 rounded-lg border max-w-[320px]"
        style={{
          background: 'var(--bg-elevated)',
          borderColor: 'var(--neon-gold)',
          borderWidth: '1px'
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Users size={20} style={{ color: 'var(--neon-gold)' }} />
          <span className="font-bold text-sm" style={{ fontFamily: 'Orbitron', color: 'var(--neon-gold)' }}>
            ALLIANCE OFFER
          </span>
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
            {metadata.terms}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Duration: {metadata.duration}
          </div>
        </div>
        
        {canRespond && (
          <div className="flex gap-2">
            <button
              className="flex items-center gap-1 px-3 py-2 rounded text-xs font-bold"
              style={{
                background: 'var(--neon-gold)20',
                border: '1px solid var(--neon-gold)',
                color: 'var(--neon-gold)',
                fontFamily: 'Rajdhani'
              }}
            >
              <CheckCircle size={14} />
              ACCEPT
            </button>
            <button
              className="flex items-center gap-1 px-3 py-2 rounded text-xs font-bold"
              style={{
                background: 'var(--neon-red)10',
                border: '1px solid var(--neon-red)',
                color: 'var(--neon-red)',
                fontFamily: 'Rajdhani'
              }}
            >
              <X size={14} />
              DECLINE
            </button>
          </div>
        )}
        
        {metadata.status === 'accepted' && (
          <div className="text-sm" style={{ color: 'var(--neon-green)' }}>
            ACCEPTED
          </div>
        )}
        
        {metadata.status === 'declined' && (
          <div className="text-sm" style={{ color: 'var(--neon-red)' }}>
            DECLINED
          </div>
        )}
        
        {metadata.status === 'countered' && metadata.counterTerms && (
          <div className="text-sm" style={{ color: 'var(--neon-orange)' }}>
            COUNTERED: {metadata.counterTerms}
          </div>
        )}
        
        {isOwn && metadata.status === 'pending' && (
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Awaiting response...
          </div>
        )}
      </div>
    );
  }
  
  return null;
};

export default SpecialMessageCard;
