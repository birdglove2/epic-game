import HealthBar from 'Components/HealthBar';

const PokemonCard = ({ attackState, character }) => {
  return (
    <div className={`${attackState === 'attacking' ? 'animate-attack' : ''}`}>
      <div className="flex flex-col text-xl font-bold p-4 rounded-lg bg-blue-800">
        <div className="flex flex-col text-xl font-bold p-4 rounded-lg bg-gray-800">
          <h2>{character.name}</h2>
          <img
            className={`w-84 h-72 rounded-lg object-cover ${
              character.hp === 0 ? 'opacity-30' : ''
            }`}
            src={`https://cloudflare-ipfs.com/ipfs/${character.imageURI}`}
            alt={`character ${character.name}`}
          />

          <HealthBar hp={character.hp} maxHp={character.maxHp} />
        </div>
        <div className="mt-4">
          <h4>{`⚔️ Atk: ${character.attackDamage}`}</h4>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
