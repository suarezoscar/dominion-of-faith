import { Scene } from 'excalibur';
import { Unit } from '../entities/Unit';
import { UnitData, UnitType, UnitLevel, Position } from '../types';
import { GAME_CONFIG } from '../config';

export class UnitSystem {
  private units: Map<string, Unit> = new Map();
  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  public createUnit(type: UnitType, level: UnitLevel, playerId: string, position: Position): Unit {
    const unitData: UnitData = {
      id: `unit-${Date.now()}-${Math.random()}`,
      type,
      level,
      playerId,
      position,
      movement: 3,
      maxMovement: 3,
      health: 100 * level,
      maxHealth: 100 * level,
      hasMoved: false,
      hasAttacked: false
    };

    const unit = new Unit(unitData);
    this.units.set(unitData.id, unit);
    this.scene.add(unit);

    return unit;
  }

  public removeUnit(unitId: string): void {
    const unit = this.units.get(unitId);
    if (unit) {
      unit.kill();
      this.units.delete(unitId);
    }
  }

  public getUnitsAtPosition(position: Position): Unit[] {
    return Array.from(this.units.values()).filter(unit => {
      const pos = unit.getData().position;
      return pos.x === position.x && pos.y === position.y;
    });
  }

  public getPlayerUnits(playerId: string): Unit[] {
    return Array.from(this.units.values()).filter(
      unit => unit.getData().playerId === playerId
    );
  }

  public attemptMerge(position: Position, playerId: string): Unit | null {
    const unitsAtPos = this.getUnitsAtPosition(position).filter(
      unit => unit.getData().playerId === playerId
    );

    if (unitsAtPos.length < 2) {
      return null;
    }

    // Buscar unidades del mismo tipo y nivel
    const groupedByTypeAndLevel = new Map<string, Unit[]>();

    unitsAtPos.forEach(unit => {
      const data = unit.getData();
      const key = `${data.type}-${data.level}`;
      if (!groupedByTypeAndLevel.has(key)) {
        groupedByTypeAndLevel.set(key, []);
      }
      groupedByTypeAndLevel.get(key)!.push(unit);
    });

    // Intentar fusionar
    for (const [key, units] of groupedByTypeAndLevel.entries()) {
      if (units.length >= 2 && units[0].getData().level < UnitLevel.Elite) {
        const unit1 = units[0];
        const unit2 = units[1];

        if (unit1.canMerge(unit2)) {
          const newUnitData = unit1.merge(unit2);

          // Remover las unidades viejas
          this.removeUnit(unit1.getData().id);
          this.removeUnit(unit2.getData().id);

          // Crear la nueva unidad fusionada
          const newUnit = new Unit(newUnitData);
          this.units.set(newUnitData.id, newUnit);
          this.scene.add(newUnit);

          return newUnit;
        }
      }
    }

    return null;
  }

  public moveUnit(unit: Unit, newPosition: Position): boolean {
    const data = unit.getData();

    if (data.hasMoved || data.movement <= 0) {
      return false;
    }

    unit.moveTo(newPosition);
    unit.setHasMoved(true);

    // Intentar fusión automática después del movimiento
    this.attemptMerge(newPosition, data.playerId);

    return true;
  }

  public resetAllUnitsForTurn(playerId: string): void {
    this.getPlayerUnits(playerId).forEach(unit => {
      unit.resetForNewTurn();
    });
  }

  public getAllUnits(): Unit[] {
    return Array.from(this.units.values());
  }

  public getUnit(unitId: string): Unit | undefined {
    return this.units.get(unitId);
  }
}

