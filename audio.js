// audio.js
const KEY = 'game_settings_v1';

function getSettings(){
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
  catch { return {}; }
}

function applyBgmVolume(bgm){
  const s = getSettings();
  const master = (s.master ?? 80) / 100;
  const bgmVol = (s.bgm ?? 70) / 100;
  bgm.volume = Math.max(0, Math.min(1, master * bgmVol));
}

document.addEventListener('DOMContentLoaded', () => {
  const bgm = document.getElementById('bgm');
  if (!bgm) return;

  bgm.preload = 'auto';
  bgm.playsInline = true; // 手機比較穩
  applyBgmVolume(bgm);

  // 嘗試自動播放（大多會被擋，沒關係）
  bgm.play().catch(() => {
    // 被擋就等使用者第一次互動再播
    const unlock = () => {
      applyBgmVolume(bgm);
      bgm.play().catch(()=>{});
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
  });
});
