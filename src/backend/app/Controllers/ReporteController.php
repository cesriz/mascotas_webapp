<?php

declare(strict_types=1);

require_once __DIR__ . '/../Models/ReporteModel.php';
require_once __DIR__ . '/../Models/MascotaModel.php';
require_once __DIR__ . '/../Services/AuthService.php';
require_once __DIR__ . '/../Validators/ReporteValidator.php';
require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/Response.php';

/**
 * Controlador de reportes.
 *
 * Permite enviar reportes sobre un anuncio de mascota.
 */
class ReporteController
{
    private ReporteModel $reporteModel;
    private MascotaModel $mascotaModel;
    private AuthService $authService;

    /**
     * Inicializa los modelos necesarios.
     */
    public function __construct()
    {
        $this->reporteModel = new ReporteModel();
        $this->mascotaModel = new MascotaModel();
        $this->authService = new AuthService();
    }

    /**
     * Intenta obtener el usuario autenticado actual sin obligar a que exista.
     *
     * Si no hay token o no es válido, devuelve null.
     */
    private function getOptionalUser(): ?array
    {
        return $this->authService->validateCurrentToken();
    }


    /**
     * Crea un nuevo reporte asociado a una mascota.
     *
     * Puede venir de:
     * - usuario autenticado
     * - usuario público
     */
    public function store(int $mascotaId): void
    {$headers = getallheaders();
    error_log("Headers recibidos: " . print_r($headers, true));

        $usuario = $this->getOptionalUser();
        $mascota = $this->mascotaModel->getById($mascotaId);

        if ($mascota === null) {
            Response::json([
                'success' => false,
                'message' => 'Mascota no encontrada'
            ], 404);
            return;
        }

        $input = Request::json();

        if ($usuario !== null) {
            $input['usuario_reportante_id'] = $usuario ? (int) $usuario['id'] : null;

            if (empty($input['nombre'])) {
                $input['nombre'] = trim(($usuario['nombre'] ?? '') . ' ' . ($usuario['apellidos'] ?? ''));
            }

            if (empty($input['correo']) && !empty($usuario['correo'])) {
                $input['correo'] = $usuario['correo'];
            }

            if (empty($input['telefono']) && !empty($usuario['telefono'])) {
                $input['telefono'] = $usuario['telefono'];
            }
        } else {
            $input['usuario_reportante_id'] = null;
        }

        $result = ReporteValidator::validateStore($input);

        if (!empty($result['errors'])) {
            Response::json([
                'success' => false,
                'errors' => $result['errors']
            ], 422);
            return;
        }

        $data = $result['data'];

        try {
            $newId = $this->reporteModel->create([
                'mascota_id' => $mascotaId,
                'usuario_reportante_id' => $data['usuario_reportante_id'],
                'usuario_propietario_id' => (int) $mascota['usuario_id'],
                'asunto' => $data['asunto'],
                'mensaje' => $data['mensaje'],
                'nombre' => $data['nombre'],
                'correo' => $data['correo'],
                'telefono' => $data['telefono'],
            ]);

            Response::json([
                'success' => true,
                'message' => 'Reporte enviado correctamente',
                'data' => [
                    'id' => $newId,
                    'mascota_id' => $mascotaId
                ]
            ], 201);
        } catch (\Throwable $e) {
            Response::json([
                'success' => false,
                'message' => 'Error al enviar el reporte',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}