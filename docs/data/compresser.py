import builtins
import datetime

from pathlib import Path
import os
import json


## Start: print上書き (AI-generated)
# 1. 元のprint関数をバックアップ（無限ループを防ぐため）
original_print = builtins.print

# 2. 新しいprint関数を定義
def timestamped_print(*args, **kwargs):
    # 現在の時刻を取得
    now = datetime.datetime.now()
    # ミリ秒（3桁）を計算
    milliseconds = now.microsecond // 1000
    # 指定されたフォーマット [yyyy/MM/dd] [hh:mm:ss.sss] を作成
    time_str = now.strftime("[%Y/%m/%d %H:%M:%S") + f".{milliseconds:03d}]"
    
    # 引数（文字列など）を結合
    output_str = " ".join(map(str, args))
    
    # 元のprint関数を使って出力
    original_print(f"{time_str} {output_str}", **kwargs)

# 3. 組み込みのprintを上書き
builtins.print = timestamped_print
## End: print上書き


current_dir = Path.cwd()
src_dir = current_dir / "src"


def path(file_path) -> str:
    return file_path.resolve().relative_to(current_dir)


def compress(json_file):
    # json読み込み & デコード
    raw_data = json_file.read_text(encoding='utf-8');
    json_data = json.loads(raw_data)

    # tips削除
    json_data.pop("tips", "")
    
    # エンコード
    compressed_data = json.dumps(json_data, separators=(',', ':'))

    # ファイル作成 & 書き込み
    new_file = current_dir / json_file.name
    new_file.write_text(compressed_data, encoding="utf-8")

    return new_file


if __name__ == "__main__":
    try:
        for json_file in src_dir.glob("*.json"):
            if json_file.exists():
                print(f"[{path(json_file)}] 圧縮開始...")
                try:
                    r = compress(json_file)
                    print(f"[{path(json_file)}] 圧縮完了 -> [{path(r)}]")
                except Exception as e:
                    print(f"[{path(json_file)}] 圧縮失敗 {e}")
    except Exception:
        print("Failed to load dir.")