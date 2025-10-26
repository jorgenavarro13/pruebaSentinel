import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { AlertTriangle, MapPin, Bell, Shield, Calendar } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function Settings() {
  const [redThreshold, setRedThreshold] = useState([75]);
  const [yellowThresholdMin, setYellowThresholdMin] = useState([45]);
  const [travelMode, setTravelMode] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dailySummary, setDailySummary] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(true);

  const handleSave = () => {
    toast.success('Configuración guardada correctamente');
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Configuración</h1>
        <p className="text-gray-400">Personaliza tus umbrales de riesgo y preferencias de seguridad</p>
      </div>

      <div className="space-y-6">
        {/* Risk Thresholds */}
        <Card className="bg-[#111827] border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-[#F59E0B]" />
              Umbrales de riesgo
            </CardTitle>
            <CardDescription>
              Define los niveles de riesgo que activan cada tipo de alerta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Red Threshold */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="flex items-center gap-2">
                  <div className="size-4 bg-[#EF4444] rounded-full" />
                  Umbral ROJO (alto riesgo)
                </Label>
                <span className="text-xl text-[#EF4444]">{redThreshold[0]}%</span>
              </div>
              <Slider
                value={redThreshold}
                onValueChange={setRedThreshold}
                min={50}
                max={100}
                step={5}
                className="[&_[role=slider]]:bg-[#EF4444] [&_[role=slider]]:border-[#EF4444]"
              />
              <p className="text-xs text-gray-400 mt-2">
                Transacciones con riesgo ≥ {redThreshold[0]}% se marcarán como ROJAS
              </p>
            </div>

            {/* Yellow Threshold */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="flex items-center gap-2">
                  <div className="size-4 bg-[#F59E0B] rounded-full" />
                  Umbral AMARILLO (riesgo medio)
                </Label>
                <span className="text-xl text-[#F59E0B]">{yellowThresholdMin[0]}% - {redThreshold[0] - 1}%</span>
              </div>
              <Slider
                value={yellowThresholdMin}
                onValueChange={setYellowThresholdMin}
                min={20}
                max={redThreshold[0] - 5}
                step={5}
                className="[&_[role=slider]]:bg-[#F59E0B] [&_[role=slider]]:border-[#F59E0B]"
              />
              <p className="text-xs text-gray-400 mt-2">
                Transacciones con riesgo entre {yellowThresholdMin[0]}% y {redThreshold[0] - 1}% se marcarán como AMARILLAS
              </p>
            </div>

            {/* Green (implicit) */}
            <div className="p-4 bg-[#0F172A] rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-4 bg-[#10B981] rounded-full" />
                <Label>Umbral VERDE (bajo riesgo)</Label>
              </div>
              <p className="text-sm text-gray-400">
                Transacciones con riesgo {'<'} {yellowThresholdMin[0]}% se marcarán como VERDES
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Travel Mode */}
        <Card className="bg-[#111827] border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="size-5 text-[#10B981]" />
              Modo Viaje
            </CardTitle>
            <CardDescription>
              Relaja las reglas de geo-localización cuando estés viajando
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-[#0F172A] rounded-xl">
              <div className="flex-1">
                <Label className="text-base mb-1">Activar modo viaje</Label>
                <p className="text-sm text-gray-400">
                  Desactiva alertas de geo-velocidad y ubicaciones inusuales
                </p>
              </div>
              <Switch
                checked={travelMode}
                onCheckedChange={setTravelMode}
              />
            </div>

            {travelMode && (
              <div className="space-y-4 p-4 border border-[#10B981]/30 rounded-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm mb-2 flex items-center gap-2">
                      <Calendar className="size-4" />
                      Fecha inicio
                    </Label>
                    <Input
                      type="date"
                      className="bg-[#0F172A] border-gray-800"
                      defaultValue="2025-10-25"
                    />
                  </div>
                  <div>
                    <Label className="text-sm mb-2 flex items-center gap-2">
                      <Calendar className="size-4" />
                      Fecha fin
                    </Label>
                    <Input
                      type="date"
                      className="bg-[#0F172A] border-gray-800"
                      defaultValue="2025-11-05"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-sm mb-2">Destino(s)</Label>
                  <Input
                    placeholder="Ej: París, Francia"
                    className="bg-[#0F172A] border-gray-800"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-[#111827] border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="size-5 text-blue-500" />
              Notificaciones
            </CardTitle>
            <CardDescription>
              Elige cómo y cuándo recibir alertas de seguridad
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#0F172A] rounded-xl">
              <div>
                <Label className="text-base mb-1">Notificaciones push</Label>
                <p className="text-sm text-gray-400">
                  Alertas instantáneas en tu dispositivo
                </p>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0F172A] rounded-xl">
              <div>
                <Label className="text-base mb-1">Notificaciones por email</Label>
                <p className="text-sm text-gray-400">
                  Recibe resumen de alertas por correo
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0F172A] rounded-xl">
              <div>
                <Label className="text-base mb-1">Resumen diario</Label>
                <p className="text-sm text-gray-400">
                  Informe diario de tu actividad a las 8:00 PM
                </p>
              </div>
              <Switch
                checked={dailySummary}
                onCheckedChange={setDailySummary}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="bg-[#111827] border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="size-5 text-[#10B981]" />
              Privacidad y Seguridad
            </CardTitle>
            <CardDescription>
              Gestiona permisos y fuentes de datos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#0F172A] rounded-xl">
              <div>
                <Label className="text-base mb-1">Autenticación biométrica</Label>
                <p className="text-sm text-gray-400">
                  Require Face ID / Touch ID para transacciones {'>'} $1,000
                </p>
              </div>
              <Switch
                checked={biometricAuth}
                onCheckedChange={setBiometricAuth}
              />
            </div>

            <div className="p-4 bg-[#0F172A] rounded-xl">
              <Label className="text-base mb-3">Fuentes de datos autorizadas</Label>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Historial de transacciones</span>
                  <span className="text-[#10B981]">✓ Activo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Geolocalización</span>
                  <span className="text-[#10B981]">✓ Activo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Patrones de uso de apps</span>
                  <span className="text-[#10B981]">✓ Activo</span>
                </div>
              </div>
              <Button
                variant="link"
                className="text-blue-500 p-0 h-auto mt-3"
              >
                Gestionar permisos →
              </Button>
            </div>

            <div className="p-4 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl">
              <p className="text-sm text-gray-300">
                <Shield className="inline size-4 mr-1 text-[#EF4444]" />
                Sentinel no recopila información personal identificable (PII) ni datos sensibles.
                Solo analizamos patrones de comportamiento para proteger tu cuenta.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          className="w-full bg-[#10B981] hover:bg-[#059669] h-12"
        >
          Guardar configuración
        </Button>
      </div>
    </div>
  );
}
