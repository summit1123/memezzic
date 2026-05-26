# Summit 리서치 findings

모드: implementation
상태: 완료

## Repo findings

- target repo는 GitHub remote `https://github.com/summit1123/memezzic.git`를 바라보는 빈 repo였다.
- 현재 branch는 `feature/memecast-mvp`다.
- `.env`는 존재하고 `OPENAI_API_KEY`가 설정되어 있으나 값은 출력하지 않았다.
- `OPENAI_IMAGE_MODEL`은 아직 `.env`에 없으므로 코드에서 기본값 `gpt-image-2`를 사용하고 `.env.example`에 안내한다.
- 기본 PATH의 `node.exe`는 Access denied이고 `npm`은 PATH에 없다. Codex bundled Node는 `C:\Users\wips\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`에서 동작한다.

## OpenAI API findings

- Official OpenAI image guide says GPT Image models include latest `gpt-image-2`, and Image API is best for generating/editing a single image from one prompt.
- The guide notes the Image API supports generation/editing and customization for quality, size, format, and compression.
- The guide states the `n` parameter can generate multiple images in one request when supported.
- API reference states GPT image models return base64 image data by default; DALL-E URL behavior is different.
- API reference lists output formats `png`, `webp`, `jpeg`, quality `low`, `medium`, `high`, `auto`, and sizes including `1024x1024`, `1024x1536`, `1536x1024`, `auto`.

Sources:
- https://developers.openai.com/api/docs/guides/image-generation
- https://developers.openai.com/api/reference/resources/images

## Design findings

- 사용자는 native app이 아니라 browser에서 실행되는 web app을 원한다.
- 디자인 계약은 Apple-like premium web product UI로 고정한다.
- Apple 로고/상표/제품명/native app chrome은 사용하지 않는다.

## Risks

- package manager가 PATH에 없어 dependency install 방법을 별도로 확보해야 한다.
- OpenAI image model access는 organization verification이나 계정 권한에 따라 실패할 수 있다.
- 실제 이미지 생성은 비용/시간이 들 수 있으므로 smoke test는 최소 request로 수행하고, 실패해도 mock mode를 유지한다.
