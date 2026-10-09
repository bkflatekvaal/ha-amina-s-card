export function getPhaseTelemetry(
  charging: boolean,
  powers: number[],
  currents: number[],
  voltages: number[],
) {
  const activePhases = powers.map((power, index) => power > 0 ? index : -1)
    .filter((index) => index >= 0);
  const threePhase = charging && activePhases.length > 1;
  const singlePhase = charging && activePhases.length === 1 ? activePhases[0] : 0;
  const sum = (values: number[]) => values.every(Number.isFinite)
    ? values.reduce((total, value) => total + value, 0) : NaN;
  const threePhaseVoltage = (!charging || threePhase)
    && voltages.every((voltage) => Number.isFinite(voltage) && voltage > 0);

  return {
    threePhase,
    threePhaseVoltage,
    currents: threePhase ? currents : [currents[0]],
    voltage: threePhaseVoltage ? sum(voltages) / 3 : threePhase ? NaN : voltages[singlePhase],
  };
}
