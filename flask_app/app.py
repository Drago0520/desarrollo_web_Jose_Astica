from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from datetime import datetime
import os
from models import db, Aviso, Comuna, Region, Foto,Comentario # Importar todo desde models.py
from sqlalchemy.orm import joinedload # Importar para optimizar consultas
from sqlalchemy import func, extract,desc
# --- Configuracion de Flask ---
app = Flask(__name__)
app.secret_key = "clave_super_secreta"
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://cc5002:programacionweb@localhost:3306/tarea2"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, "static", "uploads")

if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])


# Inicializa db con la aplicacion
with app.app_context():
    db.init_app(app)
   

# --- Rutas ---
@app.route("/")
def index():
    
    ultimos = Aviso.query.options(
        joinedload(Aviso.comuna)
    ).order_by(Aviso.fecha_ingreso.desc()).limit(5).all()
    
    
    ultimos_data = []
    for aviso in ultimos:
        comuna_obj = aviso.comuna
        
        region_obj = Region.query.get(comuna_obj.region_id) if comuna_obj else None
        
        ultimos_data.append({
            "aviso": aviso,
            "comuna_nombre": comuna_obj.nombre if comuna_obj else "Desconocida",
            "region_nombre": region_obj.nombre if region_obj else "Desconocida"
        })

    return render_template("index.html", ultimos=ultimos_data)

@app.route("/aviso", methods=["GET", "POST"])
def agregar_aviso():
    regiones = Region.query.order_by(Region.nombre).all()
    tipos_animales = ["gato", "perro"]
    unidades_medida = [("a", "años"), ("m", "meses")]

    if request.method == "POST":
        form = request.form
        files = request.files.getlist("files")
        errores = []

        #VALIDACIONES
        comuna_id = form.get("comuna_id")
        try:
            comuna_id = int(comuna_id)
            comuna_valida = Comuna.query.get(comuna_id)
            if not comuna_valida:
                 errores.append("La comuna seleccionada no existe.")
        except (ValueError, TypeError):
            errores.append("Comuna inválida.")

        tipo = form.get("tipo")
        if tipo not in tipos_animales:
             errores.append("Tipo de animal inválido.")
        
        unidad_medida = form.get("unidad")
        if unidad_medida not in [u[0] for u in unidades_medida]:
             errores.append("Unidad de medida inválida.")

        try:
            cantidad = int(form.get("cantidad"))
            if cantidad <= 0:
                errores.append("La cantidad debe ser un número positivo.")
        except (ValueError, TypeError):
            errores.append("Cantidad inválida.")

        try:
            edad = int(form.get("edad"))
            if edad < 0:
                errores.append("La edad no puede ser negativa.")
        except (ValueError, TypeError):
            errores.append("Edad inválida.")
        
        try:
            fecha_entrega = datetime.strptime(form.get("fecha_entrega"), "%Y-%m-%dT%H:%M")
        except ValueError:
            errores.append("Formato de fecha de entrega inválido.")
            fecha_entrega = None

        nombre = form.get("nombre")
        if not nombre or len(nombre) < 4:
            errores.append("Nombre debe tener al menos 4 caracteres.")

        fotos_validas = [f for f in files if f and f.filename]
        if len(fotos_validas) > 5:
            errores.append(f"Se seleccionaron {len(fotos_validas)} archivos. El máximo permitido es 5.")
        if not fotos_validas:
             errores.append("Debes subir al menos una foto.")


        if errores:
            flash(" ".join(errores))
            return render_template("aviso.html", regiones=regiones, tipos_animales=tipos_animales, unidades_medida=unidades_medida, errores=errores)

        # --- Inserción en la Base de Datos ---
        try:
            nuevo = Aviso(
                comuna_id=comuna_id,
                sector=form.get("sector"),
                nombre=form.get("nombre"),
                email=form.get("email"),
                celular=form.get("celular"),
                tipo=tipo,
                cantidad=cantidad,
                edad=edad,
                unidad_medida=unidad_medida,
                fecha_entrega=fecha_entrega,
                descripcion=form.get("descripcion")
            )

            db.session.add(nuevo)
            db.session.flush()

            for f in fotos_validas:
                ext = os.path.splitext(f.filename)[1]
                nombre_archivo = f"{nuevo.id}_{datetime.now().strftime('%Y%m%d%H%M%S')}{ext}"
                ruta_sistema_archivos = os.path.join(app.config['UPLOAD_FOLDER'], nombre_archivo)
                
                # Guardar el archivo en el sistema
                f.save(ruta_sistema_archivos)
                
                
                ruta_relativa_web = os.path.join('uploads', nombre_archivo).replace('\\', '/')
                
                foto = Foto(ruta_archivo=ruta_relativa_web, nombre_archivo=nombre_archivo, aviso_id=nuevo.id)
                db.session.add(foto)

            db.session.commit()
            flash("Aviso agregado correctamente")
            return redirect(url_for("index"))

        except Exception as e:
            db.session.rollback()
            print(f"Error al agregar aviso: {e}")
            flash("Ocurrio un error inesperado al agregar el aviso.")
            return render_template("aviso.html", regiones=regiones, tipos_animales=tipos_animales, unidades_medida=unidades_medida, errores=[f"Error de base de datos: {e}"])

    return render_template("aviso.html", regiones=regiones, tipos_animales=tipos_animales, unidades_medida=unidades_medida, errores=None)

# --- Nuevo Endpoint para AJAX de Comunas ---
@app.route("/api/comunas_por_region/<int:region_id>")
def comunas_por_region(region_id):
    comunas = Comuna.query.filter_by(region_id=region_id).order_by(Comuna.nombre).all()
    comunas_data = [{"id": c.id, "nombre": c.nombre} for c in comunas]
    return jsonify(comunas_data)

@app.route("/listado")
def listado():
    page = request.args.get("page", 1, type=int)
    per_page = 5
    

    paginador = Aviso.query.options(
        joinedload(Aviso.comuna)
    ).order_by(Aviso.fecha_ingreso.desc()).paginate(page=page, per_page=per_page, error_out=False)

   
    avisos_data = []
    for aviso in paginador.items:
        comuna_obj = aviso.comuna
        region_obj = Region.query.get(comuna_obj.region_id) if comuna_obj else None
        
        avisos_data.append({
            "aviso": aviso,
            "comuna_nombre": comuna_obj.nombre if comuna_obj else "Desconocida",
            "region_nombre": region_obj.nombre if region_obj else "Desconocida"
        })

    return render_template("listado.html", avisos=avisos_data, paginador=paginador)
@app.route("/aviso/<int:aviso_id>")
def ver_detalle_aviso(aviso_id):
    
    # Consulta para obtener el aviso y sus relaciones (fotos, comuna, región)
    # AÑADIMOS joinedload(Aviso.comentarios) para obtener los comentarios
    aviso = Aviso.query.options(
        joinedload(Aviso.fotos),
        joinedload(Aviso.comuna).joinedload(Comuna.region),
        joinedload(Aviso.comentarios).joinedload(Comentario.aviso) # Cargar comentarios
    ).get_or_404(aviso_id)
    
    
    comentarios_ordenados = sorted(aviso.comentarios, key=lambda c: c.fecha, reverse=True)

    return render_template("detalle_aviso.html", aviso=aviso, comentarios=comentarios_ordenados)




@app.route("/estadisticas")
def estadisticas():
    """Renderiza la plantilla de estadísticas."""
    return render_template("estadisticas.html")


@app.route("/api/estadisticas")
def api_estadisticas():
    try:
        # 1. Avisos agregados por dia 
     
        avisos_por_dia_raw = db.session.query(
            func.date(Aviso.fecha_ingreso).label('dia'), 
            func.count(Aviso.id).label('cantidad')
        ).group_by('dia').order_by('dia').all()
        
        datos_linea = {
            'dias': [str(row.dia) for row in avisos_por_dia_raw if row.dia is not None], 
            'avisos': [row.cantidad for row in avisos_por_dia_raw if row.dia is not None]
        }
        
        
        # 2. Total de avisos por tipo de mascota 
        
        avisos_por_tipo_raw = db.session.query(
            Aviso.tipo,
            func.count(Aviso.id).label('total')
        ).group_by(Aviso.tipo).all()

        datos_torta = [
            {'name': row.tipo.capitalize(), 'y': row.total} 
            for row in avisos_por_tipo_raw
        ]

        
        # 3. Avisos por mes y tipo 
       
        
        avisos_por_mes_y_tipo_raw = db.session.query(
            extract('month', Aviso.fecha_ingreso).label('mes_num'),
            Aviso.tipo, 
            func.count(Aviso.id).label('cantidad')
        ).group_by('mes_num', Aviso.tipo).order_by('mes_num').all()

        meses_orden = list(range(1, 13)) 
        nombres_meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
        
        gatos_por_mes = [0] * 12
        perros_por_mes = [0] * 12
        
        for row in avisos_por_mes_y_tipo_raw:
            
            try:
                mes_index = int(row.mes_num) - 1 
                if row.tipo == 'gato':
                    gatos_por_mes[mes_index] = row.cantidad
                elif row.tipo == 'perro':
                    perros_por_mes[mes_index] = row.cantidad
            except (TypeError, ValueError):
                
                 continue

        datos_barras = {
            'meses': nombres_meses, 
            'gatos': gatos_por_mes,
            'perros': perros_por_mes
        }
        
      
        return jsonify({
            'linea': datos_linea,
            'torta': datos_torta,
            'barras': datos_barras
        })

    except Exception as e:
        print(f"FATAL ERROR al obtener estadísticas: {e}")
        db.session.rollback() 
    
        return jsonify({"error": "Error interno del servidor al calcular estadísticas."}), 500

#nuevo
@app.route("/aviso/<int:aviso_id>/comentario", methods=["POST"])
def guardar_comentario(aviso_id):
    
    # 1. Validar que el aviso existe
    aviso = Aviso.query.get(aviso_id)
    if not aviso:
        flash("El aviso al que intentas comentar no existe.", "error")
        return redirect(url_for("listado"))
    
    form = request.form
    nombre = form.get("nombre_comentario", "").strip()
    texto = form.get("texto_comentario", "").strip()
    
    errores = []

    # 2. Validaciones
    if not nombre or len(nombre) < 3:
        errores.append("El nombre debe tener al menos 3 caracteres.")
    
    if not texto or len(texto) < 3:
        errores.append("El comentario es demasiado corto (mínimo 3 caracteres).")
        
    if len(texto) > 300:
        errores.append("El comentario es demasiado largo (máximo 300 caracteres).")
        
    if errores:
        flash(" ".join(errores))
        return redirect(url_for("ver_detalle_aviso", aviso_id=aviso_id))

    # 3. Guardar en la base de datos
    try:
        nuevo_comentario = Comentario(
            aviso_id=aviso_id,
            nombre=nombre,
            texto=texto
        )
        db.session.add(nuevo_comentario)
        db.session.commit()
        flash("Comentario agregado correctamente.", "success")
        
    except Exception as e:
        db.session.rollback()
        print(f"Error al guardar comentario: {e}")
        flash("Ocurrio un error inesperado al guardar el comentario.", "error")
        
    # Redireccionar de vuelta al detalle del aviso para ver el comentario
    return redirect(url_for("ver_detalle_aviso", aviso_id=aviso_id))



if __name__ == "__main__":
    app.run(debug=True)