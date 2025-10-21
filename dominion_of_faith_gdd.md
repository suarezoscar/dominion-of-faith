
# 🏰 GDD - Dominion of Faith

## 🎮 High Concept
Dominion of Faith es un juego de estrategia por turnos ambientado en un mundo medieval fantástico.
Los jugadores expanden su territorio y poder espiritual mediante la gestión de unidades básicas que se fusionan,
el control de iglesias y obispos, y la recolección de diezmos. Las partidas duran aproximadamente 50 turnos.

## 🌍 Ambientación y Narrativa
Los jugadores lideran facciones que buscan dominar un continente dividido por fe y territorio.
Las iglesias actúan como centros de influencia y generación de recursos. La narrativa combina 
conquista militar y expansión espiritual.

## ⚔️ Mecánicas Principales

### Unidades y Fusión
- Solo se pueden reclutar **unidades básicas** (nivel 1).
- **Fusión de unidades:** 2 unidades del mismo nivel en la misma casilla se combinan en nivel superior.
  - Nivel 1 → básico
  - Nivel 2 → veterano
  - Nivel 3 → élite
- Unidades de nivel superior pueden **aumentar el alcance de la influencia de fe**.
- Estrategia: dispersar unidades para controlar territorio o fusionarlas para poder militar.

### Terreno y Modificadores
| Terreno | Movimiento | Defensa | Ataque | Rango | Efecto |
|:--------|:------------|:--------|:-------|:------|:-------|
| Llanura | 1× | 1× | 1× | 1× | Sin modificadores |
| Bosque | 1.5× | 1.25× | 0.9× | 0.9× | Mayor defensa, reduce visibilidad |
| Colina | 1.25× | 1.1× | 1.1× | +1 | Ventaja táctica |
| Montaña | 2× | 1.5× | 1× | +1 | Solo unidades ligeras/voladoras |
| Río | 2× | 0.8× | 0.8× | 1× | Penaliza movimiento y combate |
| Pantano | 2× | 0.9× | 0.9× | 1× | Terreno hostil |
| Camino | 0.5× | 1× | 1× | 1× | Movimiento rápido |
| Aldea | 1× | 1.3× | 1× | 1× | Cura ligera por turno |
| Iglesia | 1× | 1.5× | 1× | 1× | Expansión de fe +25%, genera feligreses |

### Conquista y Fe
- **Iglesias:** puntos estratégicos que generan feligreses y diezmos.
- **Obispos:** unidades especiales que predican y expanden la influencia de fe.
- **Aura de influencia:** radio 2–3 casillas para conversión de terreno.
- Zonas en disputa: casillas con influencia rival se convierten gradualmente según moral y presencia.

### Suministro y Obispado
- **Conexión territorial:** solo las iglesias conectadas a un obispado pueden transferir diezmos a la base.
- **Obispado:** nodo central que acumula diezmos y recursos de iglesias conectadas.
- Zonas desconectadas → no generan ingreso ni expansión de fe.

### Sistema de Diezmo y Feligreses
- Variables principales:
  1. **Feligreses (F)**: población en la iglesia.
  2. **Diezmo (D)**: porcentaje de ingreso cobrado por la iglesia.
  3. **Conexión (C)**: 1 si iglesia conectada al obispado, 0 si desconectada.
- Fórmula simple de ingreso:
```
Ingreso = F * D * C
```
- Crecimiento de feligreses por turno:
```
ΔF = T * k * (1 - D_penalización)
```
Donde `T` = territorio seguro alrededor, `k` = constante de crecimiento.

- Estrategia: equilibrar diezmo para obtener oro sin frenar demasiado la expansión de fe.

### Economía
- Cada turno se recaudan diezmos de iglesias conectadas al obispado.
- Recursos se usan para reclutar unidades, mantener tropas y obispos.

### Bucle de Turno
1. **Fase económica:** recaudación de diezmos, ajuste de impuestos/diezmo, reclutamiento de unidades y obispos.
2. **Fase de movimiento y acción:** movimiento de unidades, fusiones, predicación de obispos, combate y captura de iglesias.
3. **Fase de influencia:** actualización de conversión de terreno según aura de obispos y unidades de apoyo.
4. **Fase de mantenimiento:** efectos de moral, rebelión, suministro, curaciones.

### Condiciones de Victoria
- **Victoria por fe:** controlar X% del mapa con influencia de tu fe.
- **Victoria militar:** destruir la base o capital enemiga.
- **Victoria por prestigio:** combinación de oro, territorio controlado y unidades de élite.

### Inspiraciones y Diferenciadores
- *Advance Wars*: fusión de unidades y combate táctico por turnos.
- *Fire Emblem*: progresión jerárquica y moral de unidades.
- *Company of Heroes*: suministro y control territorial dinámico.
- Diferenciador principal: combinación de **fusión de unidades + fe y diezmos + territorio conectado**, creando decisiones estratégicas integradas y narrativa medieval coherente.
