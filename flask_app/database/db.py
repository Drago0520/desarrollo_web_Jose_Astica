
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Enum, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from datetime import datetime
import pymysql

DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306
DB_NAME = "tarea2"
DB_CHARSET="utf8"

DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=True)  
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()



# --- Funciones para la DB ---
def get_connection():
    return pymysql.connect(
        host=DB_HOST,
        user=DB_USERNAME,
        password=DB_PASSWORD,
        database=DB_NAME,
        cursorclass=pymysql.cursors.DictCursor
    )


class Comuna(Base):
    __tablename__ = "comuna"
    id = Column(Integer, primary_key=True)
    nombre = Column(String(200), nullable=False)
    region_id = Column(Integer, ForeignKey("region.id"), nullable=False)

    avisos = relationship("Aviso", back_populates="comuna")

class Aviso(Base):
    __tablename__ = "aviso_adopcion"

    id = Column(Integer, primary_key=True)
    fecha_ingreso = Column(DateTime, default=datetime.now)
    comuna_id = Column(Integer, ForeignKey("comuna.id"), nullable=False)
    sector = Column(String(100))
    nombre = Column(String(200), nullable=False)
    email = Column(String(100), nullable=False)
    celular = Column(String(15))
    tipo = Column(Enum("gato", "perro"), nullable=False)
    cantidad = Column(Integer, nullable=False)
    edad = Column(Integer, nullable=False)
    unidad_medida = Column(Enum("a", "m"), nullable=False)
    fecha_entrega = Column(DateTime, nullable=False)
    descripcion = Column(Text(500))

    comuna = relationship("Comuna", back_populates="avisos")
    fotos = relationship("Foto", back_populates="aviso", cascade="all, delete-orphan")

class Foto(Base):
    __tablename__ = "foto"
    id = Column(Integer, primary_key=True)
    ruta_archivo = Column(String(300), nullable=False)
    nombre_archivo = Column(String(300), nullable=False)
    aviso_id = Column(Integer, ForeignKey("aviso_adopcion.id"), nullable=False)

    aviso = relationship("Aviso", back_populates="fotos")


def create_user(username, password, email):
    session = SessionLocal()
    new_user = Aviso(username=username, password=password, email=email)
    session.add(new_user)
    session.commit()
    session.close()


def crear_aviso(comuna_id, nombre, email, tipo, cantidad, edad, unidad, fecha_entrega, lista_ruta_archivo, lista_nombre_archivo, sector=None, celular=None, descripcion=None):
    session = SessionLocal()
    try:
        nuevo_aviso = Aviso(
            comuna_id=int(comuna_id),
            sector=sector,
            nombre=nombre,
            email=email,
            celular=celular,
            tipo=tipo,
            cantidad=int(cantidad),
            edad=int(edad),
            unidad_medida=unidad,
            fecha_entrega=fecha_entrega,
            descripcion=descripcion,
        )
        session.add(nuevo_aviso)
        session.flush()  

        for ruta, nombre_archivo in zip(lista_ruta_archivo, lista_nombre_archivo):
            nueva_foto = Foto(
                ruta_archivo=ruta,
                nombre_archivo=nombre_archivo,
                aviso_id=nuevo_aviso.id
            )
            session.add(nueva_foto)

        session.commit()
        print(f"Aviso creado con ID {nuevo_aviso.id}")
        return nuevo_aviso.id

    except Exception as e:
        session.rollback()
        print("Error al crear aviso:", e)
        return None
    finally:
        session.close()


if __name__ == "__main__":
    Base.metadata.create_all(engine)
    print("¡Tablas creadas!")