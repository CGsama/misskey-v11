mkdir files
mkdir .config
docker run --name glc -v "%cd%\files:/misskey/files" -v "%cd%\.config:/misskey/.config" -p 19723:3000 -d cgsama/misskey-v11:latest