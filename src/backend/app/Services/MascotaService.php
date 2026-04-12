<?php

declare(strict_types=1);

require_once __DIR__ . '/../Models/MascotaModel.php';
require_once __DIR__ . '/../Models/UbicacionModel.php';
require_once __DIR__ . '/../Models/MascotaColorModel.php';
require_once __DIR__ . '/../Models/FotoModel.php';
require_once __DIR__ . '/../Helpers/FileHelper.php';

/**
 * Servicio de mascotas.
 *
 * Aquí se concentra la lógica de negocio que implica varias tablas
 * o varias operaciones que deben hacerse como una sola unidad.
 */
class MascotaService
{
    private MascotaModel $mascotaModel;
    private UbicacionModel $ubicacionModel;
    private MascotaColorModel $mascotaColorModel;
    private FotoModel $fotoModel;

    /**
     * Inicializa los modelos necesarios para operaciones complejas.
     */
    public function __construct()
    {
        $this->mascotaModel = new MascotaModel();
        $this->ubicacionModel = new UbicacionModel();
        $this->mascotaColorModel = new MascotaColorModel();
        $this->fotoModel = new FotoModel();
    }

    /**
     * Crea una mascota completa con:
     * - ubicación
     * - anuncio principal
     * - colores asociados
     *
     * Todo se guarda dentro de una transacción.
     */
    public function create(array $data): array
    {
        try {
            $this->mascotaModel->beginTransaction();

            $ubicacionId = $this->ubicacionModel->create($data['ubicacion']);

            $mascotaId = $this->mascotaModel->create([
                'usuario_id' => $data['usuario_id'],
                'nombre' => $data['nombre'],
                'raza_id' => $data['raza_id'],
                'sexo' => $data['sexo'],
                'tiene_chip' => $data['tiene_chip'],
                'tamano' => $data['tamano'],
                'peso' => $data['peso'],
                'fecha_nacimiento' => $data['fecha_nacimiento'],
                'descripcion' => $data['descripcion'],
                'fecha_perdida' => $data['fecha_perdida'],
                'fecha_encontrada' => $data['fecha_encontrada'],
                'fecha_recuperada' => $data['fecha_recuperada'],
                'estado' => $data['estado'],
                'recompensa' => $data['recompensa'],
                'ubicaciones_perdida_id' => $ubicacionId,
            ]);

            $this->mascotaColorModel->syncColors($mascotaId, $data['colores']);

            $this->mascotaModel->commit();

            return [
                'id' => $mascotaId,
                'ubicacion_id' => $ubicacionId,
                'colores' => $data['colores']
            ];
        } catch (Throwable $e) {
            $this->mascotaModel->rollBack();
            throw $e;
        }
    }

    /**
     * Actualiza una mascota existente junto con su ubicación y sus colores.
     *
     * Recibe también el id de la ubicación actual para no volver a buscarlo aquí.
     */
    public function update(int $mascotaId, int $ubicacionId, array $data): array
    {
        try {
            $this->mascotaModel->beginTransaction();

            $this->mascotaModel->update($mascotaId, [
                'usuario_id' => $data['usuario_id'],
                'nombre' => $data['nombre'],
                'raza_id' => $data['raza_id'],
                'sexo' => $data['sexo'],
                'tiene_chip' => $data['tiene_chip'],
                'tamano' => $data['tamano'],
                'peso' => $data['peso'],
                'fecha_nacimiento' => $data['fecha_nacimiento'],
                'descripcion' => $data['descripcion'],
                'fecha_perdida' => $data['fecha_perdida'],
                'fecha_encontrada' => $data['fecha_encontrada'],
                'fecha_recuperada' => $data['fecha_recuperada'],
                'estado' => $data['estado'],
                'recompensa' => $data['recompensa'],
            ]);

            $this->ubicacionModel->update($ubicacionId, $data['ubicacion']);
            $this->mascotaColorModel->syncColors($mascotaId, $data['colores']);

            $this->mascotaModel->commit();

            return [
                'id' => $mascotaId,
                'ubicacion_id' => $ubicacionId,
                'colores' => $data['colores']
            ];
        } catch (Throwable $e) {
            $this->mascotaModel->rollBack();
            throw $e;
        }
    }

    /**
     * Guarda una o varias fotos y las registra en base de datos.
     *
     * También usa transacción para que no queden registros a medias.
     */
    public function uploadFotos(int $mascotaId, array $files): array
    {
        $savedFiles = FileHelper::saveImages($files, 'mascotas');

        try {
            $this->mascotaModel->beginTransaction();

            foreach ($savedFiles as $file) {
                $this->fotoModel->createForMascota($mascotaId, $file);
            }

            $this->mascotaModel->commit();

            return $this->fotoModel->getByMascotaId($mascotaId);
        } catch (Throwable $e) {
            $this->mascotaModel->rollBack();
            throw $e;
        }
    }
}