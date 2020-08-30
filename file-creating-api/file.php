<?php

    class File implements JsonSerializable {
        private $name;
        private $type;
        private $content;

        function jsonSerialize() {
            return [
                "name" => $this->name,
                "type" => $this->type,
                "content" => $this->content,
            ];
        }

        function __construct($name, $type, $content) {
            $this->name = $name;
            $this->type = $type;
            $this->content = $content;
        }

        public function getName() {
            return $this->name;
        }

        public function getType() {
            return $this->type;
        }

        public function getContent() {
            return $this->content;
        }
    }

?>
