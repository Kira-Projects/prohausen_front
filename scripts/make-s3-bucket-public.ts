import { S3Client, PutBucketPolicyCommand, PutPublicAccessBlockCommand } from '@aws-sdk/client-s3';
import * as path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'prohausen';
const REGION = process.env.AWS_REGION || 'us-east-2';

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function makeS3BucketPublic() {
  console.log('🔓 Configurando bucket S3 para acceso público...\n');
  console.log(`📦 Bucket: ${BUCKET_NAME}`);
  console.log(`🌎 Region: ${REGION}\n`);

  try {
    // 1. Desbloquear acceso público del bucket
    console.log('1️⃣ Removiendo bloqueo de acceso público...');
    const unblockCommand = new PutPublicAccessBlockCommand({
      Bucket: BUCKET_NAME,
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: false,
        IgnorePublicAcls: false,
        BlockPublicPolicy: false,
        RestrictPublicBuckets: false,
      },
    });

    await s3Client.send(unblockCommand);
    console.log('✅ Bloqueo de acceso público removido\n');

    // 2. Agregar política de bucket para lectura pública
    console.log('2️⃣ Aplicando política de bucket para lectura pública...');
    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${BUCKET_NAME}/*`,
        },
      ],
    };

    const policyCommand = new PutBucketPolicyCommand({
      Bucket: BUCKET_NAME,
      Policy: JSON.stringify(bucketPolicy),
    });

    await s3Client.send(policyCommand);
    console.log('✅ Política de bucket aplicada exitosamente\n');

    console.log('─'.repeat(60));
    console.log('🎉 ¡Bucket configurado correctamente!');
    console.log('─'.repeat(60));
    console.log('\n📝 Las imágenes ahora son accesibles públicamente:');
    console.log(`   https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/properties/{slug}/main.webp`);
    console.log('\n⚠️  NOTA: Esto hace que TODOS los objetos en el bucket sean públicos.');
    console.log('   Solo almacena contenido que pueda ser público.\n');

  } catch (error) {
    console.error('❌ Error configurando bucket:', error);
    
    if (error instanceof Error) {
      console.error('\n💡 Posibles soluciones:');
      console.error('   1. Verifica que las credenciales AWS tengan permisos suficientes');
      console.error('   2. El usuario IAM necesita permisos: s3:PutBucketPolicy, s3:PutBucketPublicAccessBlock');
      console.error('   3. Puedes hacerlo manualmente desde la consola de AWS:');
      console.error('      - Ve a S3 > prohausen > Permissions');
      console.error('      - Block public access: DESACTIVAR todo');
      console.error('      - Bucket policy: Agregar la política de lectura pública\n');
    }
    
    process.exit(1);
  }
}

// Ejecutar
makeS3BucketPublic();
