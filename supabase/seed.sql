-- Banco de desarrollo: 24 preguntas originales. En producción, el generador server-side
-- crea faltantes estructurados, los valida y descarta huellas similares antes de guardarlos.
insert into public.questions(axis,unit,topic,primary_skill,difficulty,context_type,resource_type,statement,options_json,correct_answer,solution,distractor_reasoning_json,validation_status,structural_fingerprint)
select
  (array['NUMBERS','ALGEBRA_FUNCTIONS','GEOMETRY','PROBABILITY_STATISTICS'])[1+((n-1)%4)],
  (array['Enteros y racionales','Proporcionalidad','Figuras geométricas','Representación de datos'])[1+((n-1)%4)],
  (array['Operaciones','Proporción directa','Área','Promedio'])[1+((n-1)%4)],
  (array['SOLVE','MODEL','REPRESENT','ARGUE'])[1+((n-1)%4)],
  1+((n-1)%5),'DAILY_LIFE','TEXT',
  case ((n-1)%4)
    when 0 then format('Un registro parte en %s, baja %s y sube 6. ¿Cuál es el saldo?',n+4,n+2)
    when 1 then format('Cada caja contiene %s unidades. ¿Cuántas hay en 4 cajas?',n+5)
    when 2 then format('Un triángulo tiene base %s y altura 6. ¿Cuál es su área?',n+4)
    else format('Tres registros son %s, %s y %s. ¿Cuál es su promedio?',n,n+3,n+6)
  end,
  case ((n-1)%4)
    when 0 then jsonb_build_object('A','8','B','2','C','6','D','-8')
    when 1 then jsonb_build_object('A',(4*(n+5))::text,'B',(n+9)::text,'C',(4*(n+4))::text,'D',(n+5)::text)
    when 2 then jsonb_build_object('A',(3*(n+4))::text,'B',(6*(n+4))::text,'C',(2*(n+10))::text,'D',(n+10)::text)
    else jsonb_build_object('A',(n+3)::text,'B',n::text,'C',(n+6)::text,'D',(3*n+9)::text)
  end,
  'A',case ((n-1)%4)
    when 0 then format('%s - %s + 6 = 8.',n+4,n+2)
    when 1 then format('4 por %s es %s.',n+5,4*(n+5))
    when 2 then format('(%s por 6) dividido por 2 es %s.',n+4,3*(n+4))
    else format('(%s + %s + %s) dividido por 3 es %s.',n,n+3,n+6,n+3)
  end,
  '{"A":"error de operación","C":"omite una etapa","D":"confunde magnitudes"}'::jsonb,'VALID',format('seed-v1-%s',n)
from generate_series(1,24) n;
