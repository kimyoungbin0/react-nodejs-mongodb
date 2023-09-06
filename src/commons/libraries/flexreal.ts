export const calculateMeanFrequency = (frequencies: any[], intensities: any[]) => {
  let sumProduct = 0;
  let totalIntensity = 0;
  const n = frequencies.length;

  for (let i = 0; i < n; i++) {
    // if (Number(intensities[i]) >= 0) {
    // Intensity 값이 0 이상인 경우에만 계산에 포함
    sumProduct += Number(frequencies[i]) * Number(intensities[i]);
    totalIntensity += Number(intensities[i]);
    // }
  }

  if (totalIntensity === 0) {
    return 0; // 분모가 0인 경우 평균 주파수는 0으로 처리
  }

  const meanFrequency = sumProduct / totalIntensity;
  return meanFrequency;
};

export const calculatePeakFrequency = (fftSpectrum: any[], sampleRate: number) => {
  const binSize = sampleRate / fftSpectrum.length;
  let maxMagnitude = 0;
  let peakIndex = 0;

  for (let i = 0; i < fftSpectrum.length; i++) {
    const magnitude = Math.abs(fftSpectrum[i]);

    if (magnitude > maxMagnitude) {
      maxMagnitude = magnitude;
      peakIndex = i;
    }
  }

  const peakFrequency = peakIndex * binSize;
  return peakFrequency;
};
