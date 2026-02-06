import Cookies from "js-cookie";

const KEY = "obras_em_casa_state";
const DAYS = 30;

export function loadState() {
  try {
    const raw = Cookies.get(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function saveState(state) {
  try {
    Cookies.set(KEY, JSON.stringify(state), { expires: DAYS, sameSite: "Lax" });
  } catch (e) {
    // se der erro (tamanho/JSON), só ignora por enquanto
  }
}

export function clearState() {
  Cookies.remove(KEY);
}
