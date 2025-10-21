# 📝 Directrices para GitHub Copilot — Lógica de “Dominion of Faith” (Online / Firebase)

## 1. Contexto del proyecto
- Juego de **estrategia por turnos** medieval-fantástico.
- Partidas **multijugador online** usando Firebase (Realtime Database o Firestore).
- Mecánicas principales: unidades, fusión, fe, iglesias, obispos, diezmos, suministro, territorio conectado.
- Turnos de duración moderada (~50 turnos por partida).

## 2. Principios generales
- Mantener **lógica modular** y separada del estado de Firebase.
- Cada sistema debe poder **funcionar offline** para testeo y luego sincronizar con Firebase.
- Usar **estructuras de datos claras** para representar:
  - Jugadores
  - Unidades
  - Terreno
  - Iglesias y obispos
  - Recursos y diezmos
  - Conexión y suministro

## 3. Sistemas principales adaptados a online

### A. Unidades y fusión
- Funciones que:
  - Crean y actualizan unidades.
  - Detectan fusiones y generan nuevas unidades.
  - Enviar cambios de unidades a Firebase después de cada turno.

### B. Terreno y modificadores
- Representar el mapa como **matriz compartida**.
- Funciones que:
  - Calculen movimiento, ataque y defensa.
  - Sincronizar el estado del mapa en Firebase.

### C. Iglesias, obispos y fe
- Guardar en Firebase:
  - Número de feligreses
  - Obispos en casillas
  - Radio de influencia
- Funciones para:
  - Actualizar conversiones de terreno.
  - Incrementar feligreses.
  - Sincronizar cambios con todos los jugadores.

### D. Suministro y obispado
- Verificar conexión territorial **global** a través del estado en Firebase.
- Bloquear ingresos si la iglesia está desconectada.
- Actualizar obispados en tiempo real para reflejar cambios de suministro.

### E. Economía y diezmos
- Funciones que calculan ingresos por iglesia y transfieren a la base del jugador.
- Guardar y actualizar ingresos, feligreses y diezmos en Firebase.

### F. Bucle de turno
1. Economía: calcular ingresos y recursos.  
2. Movimiento y acción: actualizar unidades, fusiones y predicación.  
3. Influencia: actualizar conversión de terreno y moral.  
4. Mantenimiento: curaciones, suministro y rebelión.  

- **Sincronización:** cada fase del turno se refleja en Firebase y se notifica a los jugadores activos.

## 4. Estilo recomendado
- **Funciones puras** para lógica de juego.  
- Variables descriptivas y consistentes con terminología del juego.  
- Evitar lógica UI dentro de las funciones de Firebase.  
- Mantener **documentación clara de cómo se sincroniza cada objeto en Firebase**.

## 5. Ejemplo rápido (Firebase + lógica)
```ts
// Guardar ingreso de una iglesia en Firebase
async function actualizarIngreso(iglesiaId: string, feligreses: number, diezmo: number, conectado: boolean) {
  const ingreso = conectado ? feligreses * diezmo : 0;
  await firebase.firestore().collection('iglesias').doc(iglesiaId).update({ ingreso });
}

// Fusionar unidades en Firebase
async function fusionarUnidadesCasilla(casillaId: string) {
  const casilla = await firebase.firestore().collection('casillas').doc(casillaId).get();
  const unidades = casilla.data().unidades;
  const nivel = unidades[0].nivel;
  if (unidades.length >= 2 && unidades.every(u => u.nivel === nivel)) {
    const nuevaUnidad = { nivel: nivel + 1 };
    await firebase.firestore().collection('casillas').doc(casillaId).update({ unidades: [nuevaUnidad] });
  }
}
```

