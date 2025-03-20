
/**
 * Clase para la validación y formateo de RUT chilenos
 */
export class RutValidator {
  // Constantes para la validación
  private static readonly MIN_RUT = 1000000;    // RUT mínimo válido
  private static readonly MAX_RUT = 99999999;   // RUT máximo válido
  private static readonly CLEAN_REGEX = /[^\dkK]/g; // Regex para limpiar RUT (remueve todo excepto dígitos y K/k)
  private static readonly FORMAT_REGEX = /\B(?=(\d{3})+(?!\d))/g; // Regex para formato de miles

  /**
   * Limpia un RUT de cualquier formato y lo devuelve como número y dígito verificador
   * @param rut RUT a limpiar
   * @returns Objeto con el número y dígito verificador, o null si es inválido
   */
  private static cleanRut(rut: string | null | undefined): { num: number; dv: string } | null {
    if (!rut) return null;

    try {
      // Remover todo excepto dígitos y K
      const cleanRut = rut.replace(this.CLEAN_REGEX, '').toUpperCase();
      
      // Validar longitud mínima (1 dígito + 1 verificador)
      if (cleanRut.length < 2) return null;
      
      // Separar número y dígito verificador
      const dv = cleanRut.slice(-1);
      const numStr = cleanRut.slice(0, -1);
      const num = parseInt(numStr, 10);
      
      // Validar que el número sea válido
      if (isNaN(num) || num <= 0) return null;
      
      return { num, dv };
    } catch (error) {
      return null;
    }
  }

  /**
   * Calcula el dígito verificador usando el algoritmo de módulo 11
   * @param num Número del RUT sin dígito verificador
   * @returns Dígito verificador calculado
   */
  private static calculateDV(num: number): string {
    let sum = 0;
    let multiplier = 2;
    
    // Cálculo más eficiente sin conversiones innecesarias
    let n = num;
    while (n > 0) {
      sum += (n % 10) * multiplier;
      multiplier = multiplier >= 7 ? 2 : multiplier + 1;
      n = Math.floor(n / 10);
    }
    
    const dv = 11 - (sum % 11);
    
    if (dv === 11) return '0';
    if (dv === 10) return 'K';
    return dv.toString();
  }

  /**
   * Formatea un RUT con puntos y guión (formato: XX.XXX.XXX-X)
   * @param rut RUT a formatear
   * @returns RUT formateado o el input original si es inválido
   */
  public static format(rut: string | null | undefined): string {
    if (!rut) return '';
    
    const clean = this.cleanRut(rut);
    if (!clean) return rut;

    const { num, dv } = clean;
    return `${num.toString().replace(this.FORMAT_REGEX, '.')}-${dv}`;
  }

  /**
   * Normaliza un RUT eliminando formato pero manteniendo el guión
   * @param rut RUT a normalizar
   * @returns RUT normalizado (formato: XXXXXXXX-X) o string vacío si es inválido
   */
  public static normalize(rut: string | null | undefined): string {
    if (!rut) return '';
    
    const clean = this.cleanRut(rut);
    if (!clean) return '';

    return `${clean.num}-${clean.dv}`;
  }

  /**
   * Valida un RUT usando el algoritmo de módulo 11
   * @param rut RUT a validar
   * @returns true si el RUT es válido, false en caso contrario
   */
  public static validate(rut: string | null | undefined): boolean {
    if (!rut) return false;
    
    try {
      const clean = this.cleanRut(rut);
      if (!clean) return false;

      const { num, dv } = clean;

      // Validar rango del RUT
      if (num < this.MIN_RUT || num > this.MAX_RUT) {
        return false;
      }

      // Calcular y comparar dígito verificador
      const calculatedDV = this.calculateDV(num);
      return calculatedDV === dv;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtiene solo el número del RUT sin dígito verificador
   * @param rut RUT completo
   * @returns Número del RUT o null si es inválido
   */
  public static getNumber(rut: string | null | undefined): number | null {
    if (!rut) return null;
    
    const clean = this.cleanRut(rut);
    return clean ? clean.num : null;
  }

  /**
   * Obtiene solo el dígito verificador del RUT
   * @param rut RUT completo
   * @returns Dígito verificador o null si es inválido
   */
  public static getVerifier(rut: string | null | undefined): string | null {
    if (!rut) return null;
    
    const clean = this.cleanRut(rut);
    return clean ? clean.dv : null;
  }
}