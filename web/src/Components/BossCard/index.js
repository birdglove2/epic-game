import HealthBar from 'Components/HealthBar';

const BossCard = ({ attackState, boss }) => {
  return (
    <div className={`${attackState === 'hit' ? 'animate-hitBounce' : ''}`}>
      <div className="flex flex-col text-xl font-bold p-4 rounded-lg bg-black">
        <div className="flex flex-col text-xl font-bold p-4 rounded-lg bg-gray-800">
          <h2>🔥 {boss.name} 🔥</h2>
          <img
            className="p-2 w-84 h-72 rounded-lg object-cover"
            src={`https://cloudflare-ipfs.com/ipfs/${boss.imageURI}`}
            alt={`boss ${boss.name}`}
          />

          <HealthBar hp={boss.hp} maxHp={boss.maxHp} />
        </div>
        <div className="mt-4">
          <h4>{`⚔️ Atk: ${boss.attackDamage}`}</h4>
        </div>
      </div>
    </div>
  );
};

export default BossCard;
