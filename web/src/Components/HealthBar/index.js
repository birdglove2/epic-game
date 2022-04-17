const HealthBar = ({ hp, maxHp }) => {
  return (
    <div className="mt-4 w-full bg-gray-200 rounded-xl h-8">
      <p className="absolute mt-1 left-1/2 transform -translate-x-1/2">{`${hp} / ${maxHp} HP`}</p>
      <div
        className="bg-green-600 h-8 rounded-xl"
        style={{ width: `${(hp / maxHp) * 100}%` }}
      ></div>
    </div>
  );
};

export default HealthBar;
